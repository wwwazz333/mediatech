import { Router } from "express";
import { writtenSchema } from "../models/written";
import * as writtenService from "../services/written";
const router = Router();







///Get all writtens
///return all writtens found
router.get('/', async function (req, res) {
	try {
		const authors = await writtenService.getAll();
		res.json(authors);
	}
	catch (e: any) {
		console.error("Error getting writtens", e);
		res.status(404).send(e.message);
	}
});


///Create a written
///return the created written
router.post('/', async function (req, res) {
	try {
		const newWritten = writtenSchema.parse(req.body);
		const writtenCreated = await writtenService.create(newWritten);
		res.status(201).json(writtenCreated);
	}
	catch (e: any) {
		console.error("Error creation written", e.message);
		res.status(400).send(e.message);
	}
});


///Delete a written
///return the deleted written
router.delete('/book/:idBook/by/:idAuthor', async function (req, res) {
	const { idBook, idAuthor } = req.params;
	try {
		const idBookParsed = parseInt(idBook);
		const idAuthorParsed = parseInt(idAuthor);
		const writtenDeleted = await writtenService.remove(idBookParsed, idAuthorParsed);
		res.status(200).json(writtenDeleted);
	}
	catch (e: any) {
		console.error("Error deleting written", e.message);
		res.status(400).send(e.message);
	}
});



export default router;