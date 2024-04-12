import { Router } from "express";
import { z } from "zod";
import { Borrow, BorrowSearch, borrowSearchSchema } from "../models/borrow";
import * as borrowService from "../services/borrows";
const router = Router();


router.get('/', async function (req, res) {
	try {
		const borrows = await borrowService.getAll();
		res.json(borrows);
	}
	catch (e: any) {
		console.error("Error getting borrows", e);
		res.status(404).send(e.message);
	}
});

///search borrows
router.get('/search', async function (req, res) {
	const { idUser, idBook, dateBorrow } = req.query;
	try {
		const borrowSearch: BorrowSearch = borrowSearchSchema.parse({
			idUser: idUser ? parseInt(idUser as string) : null,
			idBook: idBook ? parseInt(idBook as string) : null,
			dateBorrow: dateBorrow ? new Date(dateBorrow as string) : null
		});
		const borrows = await borrowService.searchBorrow(borrowSearch);
		res.json(borrows);
	}
	catch (e: any) {
		console.error("Error searching borrows", e.message);
		res.status(404).send(e.message);
	}
});


router.get('/user/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idParsed = z.number().parse(parseInt(id));
		const borrows = await borrowService.getByUserId(idParsed);
		res.json(borrows);
	}
	catch (e: any) {
		console.error("Error getting borrows for user id " + id, e.message);
		res.status(404).send(e.message);
	}
});


///Borrow a book
///return the created borrow
router.post('/forUser/:idUser/forBook/:idBook', async function (req, res) {
	const { idUser, idBook } = req.params;
	try {
		const idUserParsed = z.number().parse(parseInt(idUser));
		const idBookParsed = z.number().parse(parseInt(idBook));
		const newBorrow: Borrow = {
			dateBorrow: new Date(),
			idUser: idUserParsed,
			idBook: idBookParsed
		};
		console.debug("newBorrow", newBorrow)
		const borrowCreated = await borrowService.create(newBorrow);
		res.status(201).json(borrowCreated);
	}
	catch (e: any) {
		//if error constrainte error is {"errno": 19, "code": "SQLITE_CONSTRAINT" }
		console.error("Error creation borrow", e.message);
		res.status(400).send(e.message);
	}
});

///Delete a borrow
///return the deleted borrow
router.delete('/forUser/:idUser/forBook/:idBook', async function (req, res) {
	const { idUser, idBook } = req.params;
	try {
		const idUserParsed = z.number().parse(parseInt(idUser));
		const idBookParsed = z.number().parse(parseInt(idBook));
		const borrowCreated = await borrowService.remove(idUserParsed, idBookParsed);
		res.json(borrowCreated);
	}
	catch (e: any) {
		console.error("Error deleting borrow", e.message);
		res.status(400).send(e.message);;
	}
});


export default router;