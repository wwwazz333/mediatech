import { z } from "zod";
import { User, UserSearch, userSchema } from "../models/user";
import database from "./database";

const tableName = "User";


///Get all users
export async function getAll(): Promise<User[]> {
	const sql = `SELECT * FROM ${tableName}`;

	const rows = await new Promise((resolve, reject) => {
		database.all(sql, [], (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
	try {
		if (rows) {
			console.debug("rows", rows)
			const users = z.array(userSchema).parse(rows);

			return users;
		} else {
			throw new Error("No users found");
		}
	} catch (e: any) {
		throw new Error("Error parsing users from BDD");
	}
}

///search users
export async function searchUser({ id, name }: UserSearch): Promise<User[]> {
	const sql = `SELECT * FROM ${tableName} WHERE (? IS NULL OR id = ?) AND (? IS NULL OR LOWER(name) LIKE '%' || LOWER(?) || '%')`;
	const params = [id, id, name, name];

	const rows = await new Promise((resolve, reject) => {
		database.all(sql, params, (err, rows) => {
			if (err) {
				reject(err);
			} else {
				resolve(rows);
			}
		});
	});
	if (rows) {
		try {
			const users = z.array(userSchema).parse(rows);
			return users;
		} catch (e: any) {
			throw new Error("Error parsing users from BDD : " + e.message);
		}
	} else {
		throw new Error("No users found");
	}
}


///Get a user by id
export async function getById(id: number): Promise<User> {
	const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
	const params = [id];

	const row = await new Promise((resolve, reject) => {
		database.get(sql, params, (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});
	if (row) {
		try {
			const user = userSchema.parse(row);
			return user;
		} catch (e: any) {
			throw new Error("Error parsing user from BDD");
		}
	} else {
		throw new Error(`User with id ${id} not found`);
	}
}

///Create a user
export async function create(user: User): Promise<User> {
	const sql = `INSERT INTO ${tableName} (name) VALUES (?)`;
	const params = [user.name];

	return await new Promise((resolve, reject) => {
		database.run(sql, params, async function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(await getById(this.lastID));
			}
		});
	});
}

///Update a user
export async function update(id: number, user: User): Promise<User> {
	const sql = `UPDATE ${tableName} SET name = ? WHERE id = ?`;
	const params = [user.name, id];

	return await new Promise((resolve, reject) => {
		database.run(sql, params, async function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(await getById(id));
			}
		});
	});
}


///Delete a user
export async function remove(id: number): Promise<void> {
	const sql = `DELETE FROM ${tableName} WHERE id = ?`;
	const params = [id];

	await new Promise((resolve, reject) => {
		database.run(sql, params, function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
}