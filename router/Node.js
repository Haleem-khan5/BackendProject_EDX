const express = require('express');
const axios = require('axios'); // Import Axios
const books = require("./booksdb.js");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

// Route to register a new user
public_users.post("/register", (req, res) => {
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

// Route to get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Make an HTTP GET request to an external API (replace URL with your actual API endpoint)
        const response = await axios.get(`http://localhost:5000/`);
    
        // Handle successful response
        const bookData = response.data; // Assuming the API returns book data in JSON format
    
        if (!bookData) {
          return res.status(404).json({ message: "Book not found" });
        }
    
        return res.status(200).json(bookData);
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
});

// Route to get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    // Make an HTTP GET request to an external API (replace URL with your actual API endpoint)
    const response = await axios.get(`http://localhost:5000/${isbn}`);

    // Handle successful response
    const bookData = response.data; // Assuming the API returns book data in JSON format

    if (!bookData) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(bookData);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    // Make an HTTP GET request to an external API or database (replace URL with your actual API or database endpoint)
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    // Handle successful response
    const booksByAuthor = response.data; // Assuming the API returns book data in JSON format

    if (!booksByAuthor || booksByAuthor.length === 0) {
      return res.status(404).json({ message: "Books by the author not found" });
    }

    return res.status(200).json({ booksbyauthor: booksByAuthor });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;

  try {
    // Make an HTTP GET request to an external API or database (replace URL with your actual API or database endpoint)
    const response = await axios.get(`http://localhost:5000/title/${title}`);

    // Handle successful response
    const booksByTitle = response.data; // Assuming the API returns book data in JSON format

    if (!booksByTitle || booksByTitle.length === 0) {
      return res.status(404).json({ message: "Books with the title not found" });
    }

    return res.status(200).json({ booksbytitle: booksByTitle });
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to get book review
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    // Make an HTTP GET request to an external API or database (replace URL with your actual API or database endpoint)
    const response = await axios.get(`https://api.example.com/reviews/${isbn}`);

    // Handle successful response
    const bookReviews = response.data; // Assuming the API returns reviews in JSON format

    if (!bookReviews) {
      return res.status(404).json({ message: "Reviews not found for the book" });
    }

    return res.status(200).json(bookReviews);
  } catch (error) {
    // Handle errors
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports.general = public_users;
