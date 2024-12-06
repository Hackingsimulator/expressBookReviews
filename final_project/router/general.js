const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username) {
    return res.status(400).json({ message: "Username not provided" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password not provided" });
  }

  // Check if the username already exists
  const userExists = isValid(username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  user = {
    "username" : username,
    "password" : password
  };
  // Add the new user to the list
  users.push(user);
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  // books is an object, so we can return it directly
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.json(book);
});
  
// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const booksByAuthor = [];

  for (let key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found for the given author" });
  }

  return res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const booksByTitle = [];

  for (let key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found with the given title" });
  }

  return res.json(booksByTitle);
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  const reviews = book.reviews;
  if (!reviews) {
    return res.status(404).json({ message: "No reviews found for this book" });
  }

  return res.json(reviews);
});

module.exports.general = public_users;
