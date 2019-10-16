const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("./api/users-model.js")
const secrets = require("./secret/secrets");

const server = express();
server.use(express.json());

server.post('/api/signup', (req,res) => {
  const user = req.body;
  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;
  db.signUp(user)
    .then(id => res.status(201).json(id))
});

server.post('/api/login', (req,res) => {
  const user = req.body;
  db.findUser(user.username)
    .then(foundUser => {
      let {password, ...filteredUser} = foundUser;
      if (bcrypt.compareSync(user.password, password)) {
      const token = generateToken(foundUser);
        res.status(201).json({data: filteredUser, token: token})
      } else {
        res.status(400).json({message: "You shall not pass"})
      }
    })
});

server.get('/api/users', verifyToken, (req,res) => {
  db.findDepartmentUsers(req.decoded.department)
    .then(users => res.status(200).json(users))
    .catch(err => res.status(500).json({error:"error fetching data"}));
})

function verifyToken(req,res,next) {
  const token = req.headers.authorization;  
  jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
    if (err) {
      res.status(400).json({error: "Invalid token"})
    } else {
      req.decoded = decodedToken;
      next();
    }
  })
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const options = {
    expiresIn: '10m', // show other available options in the library's documentation
  };

  // extract the secret away so it can be required and used where needed
  return jwt.sign(payload, secrets.jwtSecret, options); // this method is synchronous
}
module.exports = server;