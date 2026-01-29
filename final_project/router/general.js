const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();

/**
 * TASK 6 – Register new user
 */
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }

    if (users.some(u => u.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

/**
 * TASK 1 – Get all books
 */
public_users.get('/', (req, res) => {
    res.status(200).json(books);
});

/**
 * TASK 2 – Get book by ISBN
 */
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(books[isbn]);
});

/**
 * TASK 3 – Get books by author
 */
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    let result = {};
    Object.keys(books).forEach(key => {
        if (books[key].author === author) result[key] = books[key];
    });
    res.status(200).json(result);
});

/**
 * TASK 4 – Get books by title
 */
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    let result = {};
    Object.keys(books).forEach(key => {
        if (books[key].title === title) result[key] = books[key];
    });
    res.status(200).json(result);
});

/**
 * TASK 5 – Get book reviews
 */
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(books[isbn].reviews);
});

// --------------------
// Phase 3 – Async / Axios routes

/**
 * TASK 10 – Get all books (async/await + Axios)
 */
public_users.get('/async/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

/**
 * TASK 11 – Get book by ISBN (async/await + Axios)
 */
public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ message: "Book not found" });
    }
});

/**
 * TASK 12 – Get books by author (async/await + Axios)
 */
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

/**
 * TASK 13 – Get books by title (async/await + Axios)
 */
public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Axios fetch failed:", err);
        res.status(500).json({
            message: "Error fetching books by author",
            error: err.message
        });
    }
});
module.exports.general = public_users;
