import { Router } from "express";
const router = Router();

///All CRUD operations for users are in the user service
import * as userService from "../services/users";

///Get all users
router.get('/', async function (req, res) {
	try {
		const users = await userService.getAll();
		res.json(users);
	}
	catch (e: any) {
		console.error("Error getting users", e);
		res.status(404).send(e.message);
	}
});

///Get a user by id
router.get('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idParsed = parseInt(id);
		const user = await userService.getById(idParsed);
		res.json(user);
	}
	catch (e: any) {
		console.error("Error getting user", e);
		res.status(404).send(e.message);
	}
});

///Create a user
router.post('/', async function (req, res) {
	const user = req.body;
	try {
		const userCreated = await userService.create(user);
		res.status(201).json(userCreated);
	}
	catch (e: any) {
		console.error("Error creation user", e.message);
		res.status(400).send(e.message);
	}
});

///Update a user
router.put('/:id', async function (req, res) {
	const { id } = req.params;
	const user = req.body;
	try {
		const idParsed = parseInt(id);
		const userUpdated = await userService.update(idParsed, user);
		res.json(userUpdated);
	}
	catch (e: any) {
		console.error("Error updating user", e);
		res.status(400).send(e.message);
	}
});

///Delete a user
router.delete('/:id', async function (req, res) {
	const { id } = req.params;
	try {
		const idParsed = parseInt(id);
		const previousUser = await userService.getById(idParsed);
		await userService.remove(idParsed);
		res.json(previousUser);
	}
	catch (e: any) {
		console.error("Error deleting user", e);
		res.status(400).send(e.message);
	}
});

export default router; 
