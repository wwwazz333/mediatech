import { Router } from "express";
import { z } from "zod";
import { BookSearch, bookSchema, bookSearchSchema } from "../models/books";
import * as bookService from "../services/books";
const router = Router();

///Get all books
///return all books found
router.get('/', async function (req, res) {
	try {
		let books = await bookService.getAll();

		res.json(books);
	}
	catch (e: any) {
		console.error("Error getting books", e.message);
		res.status(404).send(e.message);
	}
});

///Search books
///return the books found
router.get('/search', async function (req, res) {
	const { name, id, genre, authorName } = req.query;
	try {
		const bookSearch: BookSearch = bookSearchSchema.parse({
			id: id ? parseInt(id as string) : null,
			name: name,
			genre: genre,
			authorName: authorName
		});
		const books = await bookService.searchBook(bookSearch);
		res.json(books);
	}
	catch (e: any) {
		console.error("Error searching books", e.message);
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
