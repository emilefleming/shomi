'use strict';
exports.seed = function(knex) {
  return knex('shows').del()
    .then(function () {
      return knex('shows').insert([
        {
          "id": 1,
          "tvdb_id": 121361,
          "series_name": "Game of Thrones",
          "network": "HBO",
          "first_aired": "2011-04-17",
          "poster_url": "http://thetvdb.com/banners/_cache/posters/121361-49.jpg",
          "status": "Continuing",
          "overview": "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and the icy horrors beyond.",
          "created_at": "2017-02-16T10:54:03.697687-08:00",
          "updated_at": "2017-02-16T10:54:03.697687-08:00"
        }, {
          "id": 2,
          "tvdb_id": 311939,
          "series_name": "Game of Thrones: Cartoon Parody",
          "network": "YouTube",
          "first_aired": "2011-05-07",
          "poster_url": null,
          "status": "Ended",
          "overview": "A spoof/parody Based on HBO's hit series \"A Game of Thrones\" and George RR Martin's A Song of Ice and Fire",
          "created_at": "2017-02-16T10:54:03.697687-08:00",
          "updated_at": "2017-02-16T10:54:03.697687-08:00"
        }, {
          "id": 3,
          "tvdb_id": 320829,
          "series_name": "Hip Hop Tribe 2: Game of Thrones",
          "network": "jTBC",
          "first_aired": "2016-10-18",
          "poster_url": "http://thetvdb.com/banners/_cache/posters/320829-1.jpg",
          "status": "Continuing",
          "overview": "Tribe of Hip Hop (Hangul: 힙합의 민족) is a hip hop competition program where celebrities with little-to-no background in hip hop are teamed up with professional hip hop music producers.",
          "created_at": "2017-02-16T10:54:03.697687-08:00",
          "updated_at": "2017-02-16T10:54:03.697687-08:00"
        }, {
          "id": 4,
          "tvdb_id": 277165,
          "series_name": "Silicon Valley",
          "network": "HBO",
          "first_aired": "2014-04-06",
          "poster_url": "http://thetvdb.com/banners/_cache/posters/277165-8.jpg",
          "status": "Continuing",
          "overview": "In the high-tech gold rush of modern Silicon Valley, the people most qualified to succeed are the least capable of handling success. A comedy partially inspired by Mike Judge's own experiences as a Silicon Valley engineer in the late 1980s.",
          "created_at": "2017-02-16T10:54:11.723202-08:00",
          "updated_at": "2017-02-16T10:54:11.723202-08:00"
        }, {
          "id": 5,
          "tvdb_id": 283723,
          "series_name": "Silicon Valley Rebels",
          "network": "Smithsonian Channel",
          "first_aired": "2012-11-01",
          "poster_url": null,
          "status": "Ended",
          "overview": "Before Steve Jobs and Bill Gates, there was the \"Fairchild Eight,\" a team of young geniuses who discovered an everlasting treasure in the sands of Palo Alto. Travel back to the 1950s and witness the dawn of the electronics revolution, as told by the forefathers who built Silicon Valley from the ground up. This innovative film, by the writer of the Oscar-winning documentary The Cove, reveals how determination, jealousy, and the sheer joy of making the impossible possible drove these men to build the future and reinvent the American Dream.",
          "created_at": "2017-02-16T10:54:11.723202-08:00",
          "updated_at": "2017-02-16T10:54:11.723202-08:00"
        }, {
          "id": 6,
          "tvdb_id": 263541,
          "series_name": "Start-ups: Silicon Valley",
          "network": "Bravo (US)",
          "first_aired": "2012-11-05",
          "poster_url": "http://thetvdb.com/banners/_cache/posters/263541-1.jpg",
          "status": "Ended",
          "overview": "Bravo Media explores the intertwining lives of a group of young entrepreneurs on the path to becoming Silicon Valley's next great success stories on \"Start-Ups: Silicon Valley\" premiering Monday, November 5 at 10 p.m. ET/PT. Silicon Valley isn't a town, a neighborhood, or a zip code...it's a concept; the epicenter for the most revolutionary advances in technology and where the future of tomorrow is being created today. Sarah Austin, Dwight Crow, Kim Taylor, David Murray and brother and sister duo, Ben and Hermione Way, all have a unique perspective on the future of technology, business and how to get ahead in the most competitive culture in the country. These driven, ambitious and highly motivated individuals are all work and all play as they blaze their own paths to become the next Silicon Valley success story. While trying to find balance amidst their complicated social network they discover that in the fast paced world of Silicon Valley success and failure can come and go with just a simple keystroke.",
          "created_at": "2017-02-16T10:54:11.723202-08:00",
          "updated_at": "2017-02-16T10:54:11.723202-08:00"
        }
      ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('shows_id_seq', (SELECT MAX(id) FROM shows));"
      );
    });
};
