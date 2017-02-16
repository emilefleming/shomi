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
  let notInDb;

  request(options)
    .then((data) => {
      rawShows = JSON.parse(data);
      const resultIds = rawShows.data.map(show => show.id);

      return knex('shows').whereIn('tvdb_id', resultIds)
    })
    .then((results) => {
      shows = camelizeKeys(results);

      if (shows.length === rawShows.data.length) {
        res.send(camelizeKeys(shows));
        throw new Error('exit')
      }

      const dbIds = results.map(result => result.tvdb_id)
      notInDb = rawShows.data.filter(show => dbIds.indexOf(show.id) < 0);

      const posterPromises = rawShows.data.map((show) => {
        return getPoster(show.id)
      });

      return Promise.all(posterPromises)
    })
    .then((posters) => {
      for (let i = 0; i < notInDb.length; i++) {
        if (posters[i]) {
          notInDb[i].posterUrl = selectBestPoster(posters[i]);
        }
      }

      const newShowsPreppedForDb = notInDb.map( show => {
        const { id, seriesName, posterUrl, network, overview, status, firstAired } = show;
        return { tvdbId: id, seriesName, posterUrl, network, overview, status, firstAired };
      })

      if (newShowsPreppedForDb.length) {
        return knex('shows')
        .insert(decamelizeKeys(newShowsPreppedForDb))
        .returning('*');
      }
    })
    .then(newShowsFromDb => {
      res.send(shows.concat(camelizeKeys(newShowsFromDb)));
    })
    .catch((err) => {
      if (err.name === 'exit') {
        return;
      }

      console.log(err);
    });

});

module.exports = router;
