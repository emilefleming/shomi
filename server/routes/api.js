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
  request(options)
    .then((data) => {
      const rawShows = JSON.parse(data);
      let counter = 0;
      const countTo = rawShows.data.length;
      rawShows.data.map((rawShow) => {
        const { id, seriesName, status, network, firstAired, overview } = rawShow;
        const show = { id, seriesName, status, network, firstAired, overview };
        show.raw = rawShow;
        const posterOptions = {
          url: 'https://api.thetvdb.com/series/' + show.id + '/images/query?keyType=poster',
          method: 'get',
          headers: {
            'Authorization' : 'Bearer ' + req.token,
            'Content-Type' : 'application/json'
          }
        };
        return request(posterOptions)
        .then((response) => {
          const resObj = JSON.parse(response);
          const bestPoster = resObj.data.reduce((acc, poster) => {
            if (poster.ratingsInfo.average > acc.ratingsInfo.average) {
              acc = poster;
            }
            return acc;
          });
          show.poster = 'http://thetvdb.com/banners/' + bestPoster.thumbnail;
          shows.push(show);
          counter++;
          if (counter === countTo) {
            res.send(JSON.stringify(shows));
          }
        })
        .catch((err) => {
          console.log(err.stack);
          counter++;
        });
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
