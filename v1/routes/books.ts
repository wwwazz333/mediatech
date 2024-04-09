import { Router } from "express";
import { z } from "zod";
import { bookSchema } from "../models/books";
import * as bookService from "../services/books";
const router = Router();


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


router.post('/', async function (req, res) {
	try {
		const newBook = bookSchema.parse(req.body);
		await bookService.create(newBook);
		res.status(201).send();
	}
	catch (e: any) {
		console.error("Error creation book", e.message);
		res.status(500).json(e);
	}
});

export default router; 
