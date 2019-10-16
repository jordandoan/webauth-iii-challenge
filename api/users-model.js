const db = require("../data/dbconfig");

module.exports = {
  findUser,
  signUp,
  findDepartmentUsers
}

function findUser(username) {
  return db('users')
    .where({username: username})
    .then(users => users[0])
}

function findDepartmentUsers(department) {
  return db('users')
    .where({department: department})
    .select('users.id', 'users.username')
}
function signUp(user) {
  return db('users')
    .insert(user)
    .then(id => { return {id: id}})
}