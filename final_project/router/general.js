const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({ message: "Username and password are required" });
    }
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).send({ message: "Username already exists" });
    }
    users.push({ username, password });
    res.status(200).send({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.status(200).json(books);
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/books/async', function (req, res) {
    // Simula una async con setTimeout
    setTimeout(() => {
        res.status(200).json(books);
    }, 100); // delay per simulare async
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );
    res.status(200).json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );
    res.status(200).json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).send(book.reviews);
    } else {
        res.status(404).send({ message: "Book not found" });
    }
});

public_users.get('/books/promise/:isbn', function (req, res) {
    function getBookByISBN(isbn) {
        return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) resolve(book);
            else reject("Book not found");
        });
    }

    getBookByISBN(req.params.isbn)
        .then(book => res.status(200).json(book))
        .catch(err => res.status(404).json({message: err}));
});

// Task 12: Search by Author using async/await
public_users.get('/books/async/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();
    // Simula chiamata async
    await new Promise(resolve => setTimeout(resolve, 100));
    const found = Object.values(books).filter(
        b => b.author.toLowerCase() === author
    );
    res.status(200).json(found);
});


// Task 13: Search by Title using async/await
public_users.get('/books/async/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();
    // Simula chiamata async
    await new Promise(resolve => setTimeout(resolve, 100));
    const found = Object.values(books).filter(
        b => b.title.toLowerCase() === title
    );
    res.status(200).json(found);
});


module.exports.general = public_users;
