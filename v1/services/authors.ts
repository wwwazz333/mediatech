import { z } from "zod";
import { Author, authorSchema } from "../models/author";
import database from "./database";

const tableName = "Author";


///Get all authors
export async function getAll(): Promise<Author[]> {
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
			const authors = z.array(authorSchema).parse(rows);

			return authors;
		} else {
			throw new Error("No authors found");
		}
	} catch (e: any) {
		throw new Error("Error parsing authors from BDD");
	}
}

///Get a author by id
export async function getById(id: number): Promise<Author> {
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
			const author = authorSchema.parse(row);
			return author;
		} catch (e: any) {
			throw new Error("Error parsing author from BDD");
		}
	} else {
		throw new Error(`Author with id ${id} not found`);
	}
}

///get a author by name
///return the author found (that contains the name)
export async function getByName(name: string): Promise<Author[]> {
	const sql = `SELECT * FROM ${tableName} WHERE LOWER(name) LIKE '%' || LOWER(?) || '%'`;
	const params = [name];

	const rows = await new Promise((resolve, reject) => {
		database.all(sql, params, (err, rows) => {
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
			const authors = z.array(authorSchema).parse(rows);

			return authors;
		} else {
			throw new Error("No authors found");
		}
	} catch (e: any) {
		throw new Error("Error parsing authors from BDD");
	}
}

///Create a author
export async function create(author: Author): Promise<Author> {
	const sql = `INSERT INTO ${tableName} (id, name) VALUES (?, ?)`;
	const params = [author.id, author.name];

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

///Update a author
export async function update(id: number, author: Author): Promise<void> {
	const sql = `UPDATE ${tableName} SET name = ? WHERE id = ?`;
	const params = [author.name, id];

	await new Promise((resolve, reject) => {
		database.run(sql, params, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
}

///Delete a author
export async function remove(id: number): Promise<void> {
	const sql = `DELETE FROM ${tableName} WHERE id = ?`;
	const params = [id];

	await new Promise((resolve, reject) => {
		database.run(sql, params, (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
}