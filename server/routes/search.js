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

router.get('/:str', getToken, (req, res, next) => {
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
