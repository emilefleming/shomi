const router = require('express').Router();
const request = require('request-promise');
const knex = require('../../knex');
const { camelizeKeys, decamelizeKeys } = require('humps')

function getToken(req, res, next) {
  const options = {
    url: 'https://api.thetvdb.com/login',
    method: 'post',
    body: JSON.stringify({apikey: process.env.tvdbKey}),
    headers: {
      'Content-Type' : 'application/json',
    }
  };

  request(options)
    .then((response) => {
      req.token = JSON.parse(response).token;
      next();
    })
    .catch(err => next(err))
};

function setOptions(path, token) {
  return {
    url: `https://api.thetvdb.com${path}`,
    method: 'get',
    headers: {
      'Authorization' : 'Bearer ' + token,
      'Content-Type' : 'application/json'
    }
  };
}


router.get('/favorites/:userId/episodes', getToken, (req, res, next) => {

  function buildEpisodesPromise(tvdb_id, page) {
    const options = setOptions(`/series/${tvdb_id}/episodes?page=${page}`, req.token);

    return new Promise((resolve, reject) => {
      request(options).then(resolve).catch(()=> resolve(null))
    })
  }

  function refactorTvdbEpisodeObj(obj, showId) {
    const {
      id,
      airedSeasonID,
      language,
      absoluteNumber,
      airedEpisodeNumber,
      airedSeason,
      dvdEpisodeNumber,
      dvdSeason,
      lastUpdated,
      episodeName,
      firstAired,
      overview
    } = obj

    return {
      tvdbId: id,
      airedSeasonId: airedSeasonID,
      language: language.overview,
      absoluteNumber,
      airedEpisodeNumber,
      airedSeason,
      dvdEpisodeNumber,
      dvdSeason,
      lastUpdated,
      episodeName,
      firstAired,
      overview,
      showId
    }
  }

  function updateEpisodesForShow(tvdb_id) {
    return new Promise((resolve, reject) => {
      const summaryRequest = setOptions(`/series/${tvdb_id}/episodes/summary`, req.token);

      return request(summaryRequest)
        .then( summaryJSON => {
          const episodesPromises = []
          const summary = JSON.parse(summaryJSON);
          const hundredsOfEpisodes = Math.ceil(summary.data.airedEpisodes / 100)

          for (let j = 1; j <= hundredsOfEpisodes; j++) {
            episodesPromises.push(
              buildEpisodesPromise(tvdb_id, j)
            )
          }

          return Promise.all(episodesPromises);
        })
        .then( responseJSON  => {
          const rawEpisodes = JSON.parse(responseJSON).data;

          const episodes = rawEpisodes.map(episode =>
            refactorTvdbEpisodeObj(episode, tvdb_id)
          );
          resolve(episodes);
        })


        .catch( err => {console.log(err)})
    })
  }

  const favoriteShows = [];
  const epsToInsert = [];
  let episodeIds;
  let allEpisodes;
  let epsToUpdate;

  knex('favorites')
    .select('shows.tvdb_id')
    .where('user_id', req.params.userId)
    .innerJoin('shows', 'favorites.show_id', 'shows.id')
    .then( favoritesList => {
      const getEpisodesForShowPromises = favoritesList.map(({tvdb_id}) => {
        favoriteShows.push(tvdb_id)
        return updateEpisodesForShow(tvdb_id)
      });

      return Promise.all(getEpisodesForShowPromises)
    })
    .then( episodesArrs => {
      allEpisodes = episodesArrs.reduce( (acc, array) => acc.concat(array), []);
      episodeIds = allEpisodes.map( episode => episode.tvdbId)

      return knex('episodes')
        .select('tvdb_id')
        .whereIn('tvdb_id', episodeIds)
    })
    .then( existingRows => {
      const existingIds = existingRows.map( row => row.tvdb_id )

      epsToUpdate = allEpisodes.filter( episode => {
        if ( existingIds.indexOf(episode.tvdbId) < 0 ) {
          epsToInsert.push(decamelizeKeys(episode));

          return false;
        }

        return true;
      })

      return knex('episodes')
        .insert(epsToInsert)
    })
    .then(() => {
      return Promise.all( epsToUpdate.map( episode => {
        const id = episode.tvdbId;

        return knex('episodes')
          .update(decamelizeKeys(episode))
          .where('tvdb_id', id)
      }
      ));
    })
    .then((response) => {
      return knex('episodes')
        .select([
          'episodes.id AS id',
          'episodes.show_id',
          'episodes.episode_name',
          'episodes.first_aired',
          'episodes.overview',
          'watched_episodes.episode_id AS watched'
        ])
        .whereIn('tvdb_id', episodeIds)
        .leftJoin('watched_episodes', function() {
          this.on('episodes.id', '=', 'watched_episodes.episode_id')
          .on('watched_episodes.user_id', '=', knex.raw(req.params.userId))
        })
    })
    .then((episodes) => {
      res.send(episodes);
    })

    // .then( summaries => {
    //   const episodesForShowsPromises = []
    //   for (let i = 0; i < summaries.length; i++) {
    //     const summary = JSON.parse(summaries[i]);
    //     const hundredsOfEpisodes = Math.ceil(summary.data.airedEpisodes / 100)
    //
    //     for (let j = 1; j <= hundredsOfEpisodes; j++) {
    //       episodesForShowsPromises.push(
    //         buildEpisodesPromise(favoritesIds[i], j)
    //       )
    //     }
    //   }
    //   return Promise.all(episodesForShowsPromises);
    // })
    // .then( episodesList => { return knex.raw(buildRawQuery(episodesList))
    //   function refactorTvdbEpisodeObj(obj) {
    //     const {
    //       id,
    //       airedSeasonID,
    //       absoluteNumber,
    //       airedEpisodeNumber,
    //       airedSeason,
    //       dvdEpisodeNumber,
    //       dvdSeason,
    //       lastUpdated,
    //       episodeName,
    //       firstAired,
    //       language,
    //       overview
    //     } = obj
    //
    //     return {
    //       tvdb_id: id,
    //       airedSeasonId: airedSeasonID,
    //       absoluteNumber,
    //       airedEpisodeNumber,
    //       airedSeason,
    //       dvdEpisodeNumber,
    //       dvdSeason,
    //       lastUpdated,
    //       episodeName,
    //       firstAired,
    //       language,
    //       overview
    //     }
    //   }
    //
    //   objectsToQueryValues(arr) {
    //     const parsedEpisodeLists = []
    //
    //     for (let i = 0; i < episodesList.length; i++) {
    //       const parsedList = JSON.parse(episodesList[i]).data;
    //
    //       const objectsToInsert = parsedList.map( episode {
    //         if (episode.episodeName && episode.firstAired) {
    //           return refactorTvdbEpisodeObj(episode);
    //         }
    //       })
    //     }
    //   }
    //
    //   function buildRawQuery(array) {
    //   }
    //
    //   return knex('episodes')
    //     .insert(decamelizeKeys(parsedEpisodeLists), '*')
    // })
    // .then( addedEpisodes => {
    //   res.send(addedEpisodes);
    // })

})

router.get('/favorites/:userId', (req, res, next) => {
  knex('favorites')
    .select(
      'shows.id AS id',
      'shows.poster_url',
      'shows.series_name',
      'shows.overview',
      'shows.first_aired',
      'shows.network',
      'shows.status'
    )
    .where('user_id', req.params.userId)
    .innerJoin('shows', 'favorites.show_id', 'shows.id')
    .then(favoriteShows => {
      return res.send(camelizeKeys(favoriteShows));
    })
    .catch(err => { console.log(err) })
})

router.post('/favorites/:userId', (req, res, next) => {
  console.log({ user_id: req.params.userId, show_id: req.body.showId });
  knex('favorites')
    .insert({ user_id: req.params.userId, show_id: req.body.showId }, '*')
    .then(newFavorite => {
      res.send(newFavorite)
    })
    .catch(err => { console.log(err) })
})

router.delete('/favorites/:userId/:showId', (req, res, next) => {
  const { userId, showId } = req.params;

  knex('favorites')
    .del('*')
    .where({
      user_id: userId,
      show_id: showId
    })
    .then(deletedRows => {
      res.send(deletedRows)
    })
    .catch(err => { console.log(err) })
})

router.get('/search/:str', getToken, (req, res, next) => {
  function getPoster(id) {
    const posterOptions = {
      url: 'https://api.thetvdb.com/series/' + id + '/images/query?keyType=poster',
      method: 'get',
      headers: {
        'Authorization' : 'Bearer ' + req.token,
        'Content-Type' : 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      request(posterOptions).then(resolve).catch(()=> resolve(null))

    })
  }

  function selectBestPoster(postersJSON) {
    const posters = JSON.parse(postersJSON);
    const bestPoster = posters.data.reduce((acc, poster) => {
      if (poster.ratingsInfo.average > acc.ratingsInfo.average) {
        acc = poster;
      }
      return acc;
    });
    return 'http://thetvdb.com/banners/' + bestPoster.thumbnail;
  }

  const options = {
    url: 'https://api.thetvdb.com/search/series?name=' + req.params.str,
    method: 'get',
    headers: {
      'Authorization' : 'Bearer ' + req.token,
      'Content-Type' : 'application/json'
    }
  };

  let shows = [];
  let rawShows;
  let showsToGrab;
  let showsToUpdateOnly = [];

  request(options)
    .then((data) => {
      rawShows = JSON.parse(data);
      const resultIds = rawShows.data.map(show => show.id);

      return knex('shows').whereIn('tvdb_id', resultIds)
    })
    .then((resultsDecamelized) => {
      results = camelizeKeys(resultsDecamelized);
      const dbIds = [];

      results.map(show => {
        const now = new Date();
        const then = new Date(show.updatedAt)
        // const acceptableAge = 1000 * 60 * 60 * 24;
        const acceptableAge = 1;

        if (now - then < acceptableAge) {
          dbIds.push(show.id)
          return shows.push(show)
        }

        showsToUpdateOnly.push(show.tvdbId)
      })

      if (shows.length === rawShows.data.length) {
        res.send(camelizeKeys(shows));
        throw new Error('exit')
      }

      showsToGrab = rawShows.data.filter(show => dbIds.indexOf(show.id) < 0);

      const posterPromises = rawShows.data.map((show) => {
        return getPoster(show.id)
      });

      return Promise.all(posterPromises)
    })
    .then((posters) => {
      for (let i = 0; i < showsToGrab.length; i++) {
        if (posters[i]) {
          showsToGrab[i].posterUrl = selectBestPoster(posters[i]);
        }
      }

      const showsToAdd = [];
      const showsToUpdate = [];

      showsToGrab.map( show => {
        const { id, seriesName, posterUrl, network, overview, status, firstAired } = show;
        const obj = { tvdbId: id, seriesName, posterUrl, network, overview, status, firstAired };

        if (showsToUpdateOnly && showsToUpdateOnly.indexOf(id) < 0) {
          showsToAdd.push(obj)
        }
        else {
          console.log(obj.tvdbId);
          showsToUpdate.push(
            knex('shows')
              .where('tvdb_id', Number(obj.tvdbId))
              .update(decamelizeKeys(obj), '*')
          )
        };
      })

      return Promise.all(
        [ ...showsToUpdate,
          knex('shows')
            .insert(decamelizeKeys(showsToAdd), '*')
        ]
      )
    })
    .then(newShowsFromDb => {
      const newShows = [].concat.apply([], newShowsFromDb);
      res.send(shows.concat(camelizeKeys(newShows)));
    })
    .catch((err) => {
      if (err.name === 'exit') {
        return;
      }

      console.log(err);
    });

});

module.exports = router;
