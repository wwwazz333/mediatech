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
		res.status(500).json(e);
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
		return res.status(400).json(e);
	}
});

///Create a book
///return the created book
router.post('/', async function (req, res) {
	try {
		const newBook = bookSchema.parse(req.body);
		await bookService.create(newBook);
		res.status(201).json(newBook);
	}
	catch (e: any) {
		console.error("Error creation book", e.message);
		res.status(500).json(e);
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
		res.status(500).json(e);
	}
});

export default router; 
