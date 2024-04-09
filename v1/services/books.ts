import { z } from "zod";
import { Book, bookSchema } from "../models/books";
import database from "./database";

const tableName = "Book";

///Get all books
export async function getAll(): Promise<Book[]> {
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
		console.debug("rows", rows)
		const books = z.array(bookSchema).parse(rows);

		return books;
	} catch (e: any) {
		throw new Error("Error parsing books from BDD");
	}
}

///Get a book by id
export async function getById(id: number): Promise<Book> {
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
			const book = bookSchema.parse(row);
			return book;
		} catch (e: any) {
			throw new Error("Error parsing book from BDD");
		}
	} else {
		throw new Error(`Book with id ${id} not found`);
	}
}

///Create a book
export async function create(book: Book): Promise<Book> {
	const sql = `INSERT INTO ${tableName} (id, name, description, genre, numberAvailable) VALUES (?, ?, ?, ?, ?)`;
	const params = [book.id, book.name, book.description, book.genre, book.numberAvailable];

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


///Update a book
export async function update(id: number, book: Book): Promise<void> {
	const sql = `UPDATE ${tableName} SET name = ?, description = ?, genre = ?, numberAvailable = ? WHERE id = ?`;
	const params = [book.name, book.description, book.genre, book.numberAvailable, id];

	await new Promise(async (resolve, reject) => {
		await database.run(sql, params, async (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(null);
			}
		});
	});
}


///Delete a book
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