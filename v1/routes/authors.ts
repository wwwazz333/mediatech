import { Router } from "express";
import { z } from "zod";
import { authorSchema } from "../models/author";
import * as authorService from "../services/authors";
const router = Router();

///Get all authors
///return all authors found
router.get('/', async function (req, res) {
	try {
		const authors = await authorService.getAll();
		res.json(authors);
	}
	catch (e: any) {
		console.error("Error getting authors", e);
		res.status(404).send(e.message);
	}
});

///Get a author by id
///return the author found
router.get('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idAuthor = z.number().parse(parseInt(id));
		const author = await authorService.getById(idAuthor);
		res.json(author);

	} catch (e: any) {
		console.error(`Error parsing id ${id}`, e.message);
		return res.status(404).send(e.message);
	}
});

///Create a author
///return the created author
router.post('/', async function (req, res) {
	try {
		const newAuthor = authorSchema.parse(req.body);
		const authorCreated = await authorService.create(newAuthor);
		res.status(201).json(authorCreated);
	}
	catch (e: any) {
		console.error("Error creation author", e.message);
		res.status(400).send(e.message);
	}
});

///Update a author
///return the updated author updated
router.put('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idAuthor = z.number().parse(parseInt(id));
		const newAuthor = authorSchema.parse(req.body);
		await authorService.update(idAuthor, newAuthor);
		res.status(200).json(newAuthor);
	}
	catch (e: any) {
		console.error("Error updating author", e.message);
		res.status(400).send(e.message);
	}
});

///Delete a author
///return the deleted author
router.delete('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idAuthor = z.number().parse(parseInt(id));
		const author = await authorService.getById(idAuthor);
		await authorService.remove(idAuthor);
		res.status(200).json(author);
	}
	catch (e: any) {
		console.error("Error deleting author", e.message);
		res.status(400).send(e.message);
	}
});


export default router; 
