const router = require('express').Router();
const request = require('request-promise');
const knex = require('../../knex');
const { camelizeKeys, decamelizeKeys } = require('humps')

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


router.get('/:userId/episodes', getToken, (req, res, next) => {

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

    if (!id || !episodeName || !firstAired) {
      return null;
    }

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

  function updateEpisodesForShow(tvdb_id, id) {
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
          const rawEpisodes = responseJSON.reduce((acc, arr) =>
            acc.concat(JSON.parse(arr).data)
          , [])
          const episodes = rawEpisodes.map(episode =>
            refactorTvdbEpisodeObj(episode, id)
          );
          const episodesThatExist = episodes.filter(Boolean);

          resolve(episodesThatExist);
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
    .select(['shows.tvdb_id', 'shows.id'])
    .where('user_id', req.params.userId)
    .innerJoin('shows', 'favorites.show_id', 'shows.id')
    .then( favoritesList => {
      const getEpisodesForShowPromises = favoritesList.map(({tvdb_id, id}) => {
        favoriteShows.push(tvdb_id)
        return updateEpisodesForShow(tvdb_id, id)
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
          'episodes.aired_season',
          'episodes.aired_episode_number',
          'watched_episodes.episode_id AS watched',
          'shows.poster_url',
          'shows.series_name'
        ])
        .orderBy('episodes.first_aired', 'desc')
        .whereIn('episodes.tvdb_id', episodeIds)
        .leftJoin('watched_episodes', function() {
          this.on('episodes.id', '=', 'watched_episodes.episode_id')
          .on('watched_episodes.user_id', '=', knex.raw(req.params.userId))
        })
        .leftJoin('shows', 'episodes.show_id', 'shows.id')
    })
    .then((episodes) => {
      res.send(camelizeKeys(episodes));
    })
})

router.get('/:userId', (req, res, next) => {
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

router.post('/:userId', (req, res, next) => {
  console.log({ user_id: req.params.userId, show_id: req.body.showId });
  knex('favorites')
    .insert({ user_id: req.params.userId, show_id: req.body.showId }, '*')
    .then(newFavorite => {
      res.send(newFavorite)
    })
    .catch(err => { console.log(err) })
})

router.delete('/:userId/:showId', (req, res, next) => {
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

module.exports =  router;
