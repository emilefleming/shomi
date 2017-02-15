const router = require('express').Router();
const request = require('request-promise');

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

function getPoster(id, token) {
  const posterOptions = {
    url: 'https://api.thetvdb.com/series/' + id + '/images/query?keyType=poster',
    method: 'get',
    headers: {
      'Authorization' : 'Bearer ' + token,
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

router.get('/search/:str', getToken, (req, res, next) => {
  const options = {
    url: 'https://api.thetvdb.com/search/series?name=' + req.params.str,
    method: 'get',
    headers: {
      'Authorization' : 'Bearer ' + req.token,
      'Content-Type' : 'application/json'
    }
  };
  const shows = [];
  const posterPromises = [];
  return request(options)
    .then((data) => {
      const rawShows = JSON.parse(data);
      const promiseArr = [];

      rawShows.data.map((rawShow) => {
        const { id, seriesName, status, network, firstAired, overview } = rawShow;
        const show = { id, seriesName, status, network, firstAired, overview };

        shows.push(show);
        posterPromises.push(getPoster(id, req.token))
      });

      Promise.all(posterPromises)
        .then((posters) => {
          for (let i = 0; i < shows.length; i++) {
            if (posters[i]) {
              console.log(posters[i]);
              shows[i].poster = selectBestPoster(posters[i]);
            }
          }
          return res.send(shows);
        })
        .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err));

});

module.exports = router;
