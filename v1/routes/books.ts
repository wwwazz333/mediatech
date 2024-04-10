import { Router } from "express";
import { z } from "zod";
import { bookSchema } from "../models/books";
import * as bookService from "../services/books";
const router = Router();

///Get all books
///return all books found
router.get('/', async function (req, res) {
	try {
		const books = await bookService.getAll();
		res.json(books);
	}
	catch (e: any) {
		console.error("Error getting books", e);
		res.status(404).send(e.message);
	}
});

///Get a book by id
///return the book found
router.get('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idBook = z.number().parse(parseInt(id));
		const book = await bookService.getById(idBook);
		res.json(book);

	} catch (e: any) {
		console.error(`Error parsing id ${id}`, e.message);
		return res.status(404).send(e.message);
	}
});


///Get books by name
///return the books found (that contains the name)
router.get('/name/:name', async function (req, res) {
	const { name } = req.params;
	try {
		const books = await bookService.getByName(name);
		res.json(books);

	} catch (e: any) {
		console.error(`Error parsing books ${name}`, e.message);
		return res.status(404).send(e.message);
	}
});

///Get books by genre
///return the books found (that contains the genre)
router.get('/genre/:genre', async function (req, res) {
	const { genre } = req.params;
	try {
		const books = await bookService.getByGenre(genre);
		res.json(books);

	} catch (e: any) {
		console.error(`Error parsing books ${genre}`, e.message);
		return res.status(404).send(e.message);
	}
});

///Get books by author name
///return the books found (written by the author)
router.get('/author/:nameAuthor', async function (req, res) {
	const { nameAuthor } = req.params;
	try {
		const books = await bookService.getByAuthor(nameAuthor);
		res.json(books);

	} catch (e: any) {
		console.error(`Error parsing books ${nameAuthor}`, e.message);
		return res.status(404).send(e.message);
	}
});

///Create a book
///return the created book
router.post('/', async function (req, res) {
	try {
		const newBook = bookSchema.parse(req.body);
		const bookCreated = await bookService.create(newBook);
		res.status(201).json(bookCreated);
	}
	catch (e: any) {
		console.error("Error creation book", e.message);
		res.status(400).send(e.message);
	}
});

///Update a book
///return the updated book updated
router.put('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idBook = z.number().parse(parseInt(id));
		const newBook = bookSchema.parse(req.body);
		await bookService.update(idBook, newBook);
		res.status(200).json(newBook);
	}
	catch (e: any) {
		console.error("Error updating book", e.message);
		res.status(400).send(e.message);
	}
});


///Delete a book
///return the deleted book
router.delete('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idBook = z.number().parse(parseInt(id));
		const oldBook = await bookService.getById(idBook);
		console.debug("oldBook", oldBook)
		await bookService.remove(idBook);
		res.status(200).json(oldBook);
	}
	catch (e: any) {
		console.error("Error deleting book", e.message);
		res.status(400).send(e.message);
	}
});

export default router; 
