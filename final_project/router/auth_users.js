const express = require('express'); 
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if username is valid (NOT already taken)
const isValid = (username) => {
    return !users.find(user => user.username === username);
}

// check if username & password match
const authenticatedUser = (username, password) => {
    return users.find(
        user => user.username === username && user.password === password
    );
}

// only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    let token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });
    req.session.authorization = { token, username };

    return res.status(200).json({ message: "Login successful" });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
