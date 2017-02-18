'use strict';

exports.seed = function(knex) {
  return knex('episodes').del()
    .then(function () {
      return knex('episodes')
        .insert([
          {
            "id": 21,
            "show_id": 121361,
            "tvdb_id": 5579003,
            "absolute_number": 53,
            "aired_episode_number": 3,
            "aired_season": 6,
            "aired_season_id": 651357,
            "dvd_episode_number": 3,
            "dvd_season": 6,
            "last_updated": 1485719974,
            "language": "en",
            "episode_name": "Oathbreaker",
            "first_aired": "2016-05-08",
            "overview": "Daenerys meets her future. Bran meets the past. Tommen confronts the High Sparrow. Arya trains to be No One. Varys finds an answer. Ramsay gets a gift.\r\n"
          }, {
            "id": 6,
            "show_id": 121361,
            "tvdb_id": 5083694,
            "absolute_number": 41,
            "aired_episode_number": 1,
            "aired_season": 5,
            "aired_season_id": 607490,
            "dvd_episode_number": 1,
            "dvd_season": 5,
            "last_updated": 1466154259,
            "language": "en",
            "episode_name": "The Wars to Come",
            "first_aired": "2015-04-12",
            "overview": "Cersei and Jaime adjust to a world without Tywin; Varys reveals a conspiracy to Tyrion; Daenerys faces a new threat to her rule; Jon is caught between two kings."
          }, {
            "id": 7,
            "show_id": 121361,
            "tvdb_id": 5469015,
            "absolute_number": 51,
            "aired_episode_number": 1,
            "aired_season": 6,
            "aired_season_id": 651357,
            "dvd_episode_number": 1,
            "dvd_season": 6,
            "last_updated": 1476616262,
            "language": "en",
            "episode_name": "The Red Woman",
            "first_aired": "2016-04-24",
            "overview": "Jon Snow is dead. Daenerys meets a strong man. Cersei sees her daughter again."
          }, {
            "id": 8,
            "show_id": 121361,
            "tvdb_id": 4045941,
            "absolute_number": null,
            "aired_episode_number": 2,
            "aired_season": 0,
            "aired_season_id": 137481,
            "dvd_episode_number": null,
            "dvd_season": null,
            "last_updated": 1310428162,
            "language": "en",
            "episode_name": "15-Minute Preview",
            "first_aired": "2011-04-03",
            "overview": "An approximately 15-minute preview of the first episode of Game of Thrones."
          }, {
            "id": 9,
            "show_id": 121361,
            "tvdb_id": 3436411,
            "absolute_number": 2,
            "aired_episode_number": 2,
            "aired_season": 1,
            "aired_season_id": 364731,
            "dvd_episode_number": 2,
            "dvd_season": 1,
            "last_updated": 1433646601,
            "language": "en",
            "episode_name": "The Kingsroad",
            "first_aired": "2011-04-24",
            "overview": "Having agreed to become the King’s Hand, Ned leaves Winterfell with daughters Sansa and Arya, while Catelyn stays behind in Winterfell. Jon Snow heads north to join the brotherhood of the Night’s Watch. Tyrion decides to forego the trip south with his family, instead joining Jon in the entourage heading to the Wall. Viserys bides his time in hopes of winning back the throne, while Daenerys focuses her attention on learning how to please her new husband, Drogo."
          }, {
            "id": 12,
            "show_id": 121361,
            "tvdb_id": 4801602,
            "absolute_number": 32,
            "aired_episode_number": 2,
            "aired_season": 4,
            "aired_season_id": 568657,
            "dvd_episode_number": 2,
            "dvd_season": 4,
            "last_updated": 1451473185,
            "language": "en",
            "episode_name": "The Lion and the Rose",
            "first_aired": "2014-04-13",
            "overview": "A who’s who of honored guests turns out for Joffrey and Margaery’s wedding in King’s Landing, but the king’s taste in entertainment rubs many of them the wrong way. Meanwhile, Bronn gives a lesson to an unlikely pupil; Bran’s vision helps map out his journey; Stannis loses patience with Davos; and Ramsay takes a perverse delight in his new pet."
          }
        ])
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('episodes_id_seq', (SELECT MAX(id) FROM episodes));"
      );
    })
};
