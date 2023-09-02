const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = ["haleem"];

const isValid = (username) => {
  // Check if the username is valid (e.g., meets certain criteria)
  const usernameRegex = /^[a-zA-Z0-9_]{4,}$/; // Example regular expression for username validation

  return usernameRegex.test(username);
};

const findUserByUsername = (username) => {
  // Find a user in the users array based on their username
  return users.find((user) => user.username === username);
};

// Register a new user
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  console.log("register router")
  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if the username is already taken
  if (findUserByUsername(username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Login a user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  console.log("Login router")

  // Find the user in the users array
  const user = findUserByUsername(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token
  const token = jwt.sign({ username }, "secret_key");

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  console.log(req.body)
  const { username, review } = req.body;

  if (!users.includes(username)) {
    return res.status(403).json({ message: "Unauthorized: User not found in the users list" });
  }
  // Find the book in the database
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add the review to the book object

  book.reviews[username] = review;

  return res.status(200).json({ message: `The review for ${book.title} having isbn ${isbn} is updated\added` });
});

regd_users.delete("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.body;

  if (!users.includes(username)) {
    return res.status(403).json({ message: "Unauthorized: User not found in the users list" });
  }
  // Find the book in the database
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists for the given username
  if (!book.reviews.hasOwnProperty(username)) {
    return res.status(404).json({ message: "Review not found for the given username" });
  }

  // Delete the review for the given username
  delete book.reviews[username];

  console.log(books[isbn]);

  return res.status(200).json({ message: `Review for the isbn ${isbn} by the ${username} is deleted ` });
});


module.exports.authenticated = regd_users;
