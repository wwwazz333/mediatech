import { Router } from "express";
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
		res.status(500).send(e.message);
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
		res.status(500).send(e.message);
	}
});

export default router; 
