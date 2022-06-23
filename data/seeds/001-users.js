const bcrypt = require("bcryptjs");
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: "test", password: bcrypt.hashSync('pass', 14), department:"Meteorology"},
        {username: "test2", password: bcrypt.hashSync('pass', 14), department:"Meteorology"},
        {username: "test3", password: bcrypt.hashSync('pass', 14), department:"Meteorology"},
        {username: "test4", password: bcrypt.hashSync('pass', 14), department:"Psychology"},
      ]);
    });
};
