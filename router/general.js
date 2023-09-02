const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  console.log("general tools")
  const { username, password } = req.body;

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if the username is already taken
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;
  console.log(isbn)
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json( book );
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;
  const filteredBooks = Object.values(books).filter((book) =>
    book.author === author
  );

  return res.status(200).json({ booksbyauthor: filteredBooks });
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;
  const filteredBooks = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  );

  // Create an array to store the filtered books with ISBNs
  const booksWithISBNs = [];

  // Iterate through the filtered books and assign ISBNs based on their index in the `books` object
  for (const book of filteredBooks) {
    const isbn = Object.keys(books).find((key) => books[key] === book); // Get the ISBN based on the book object
    const { author, reviews } = book; // Extracting author and reviews
    booksWithISBNs.push({ isbn, author, reviews });
  }

  return res.status(200).json({ booksbytitle: booksWithISBNs });
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json( book.reviews );
});

module.exports.general = public_users;

