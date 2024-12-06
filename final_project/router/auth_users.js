const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    for(let user in users){
        if (user.username === username) {
            return false;
        }
        return true;
    }
}

const authenticatedUser = (username,password)=>{ 
    for(let user in users){
        if(user.username != username){
            return false
        }
        if(user.password != password){
            return false
        }
    }
    return true
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(authenticatedUser(username, password)){
    const token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: '1h' });

    // Store the token in the session
    if (!req.session.authorization) {
      req.session.authorization = {};
    }
    req.session.authorization.accessToken = token;
  
    // Return success response
    return res.status(201).json({ 
      message: "User logged in successfully", 
      token: token 
    });
  }
  return res.status(410).json({message: "Wrong Email or Password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
