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
		console.error("Error parsing books from BDD", e.message);
		throw new Error("Error parsing books from BDD");
	}
}

//Create a book
export async function create(book: Book): Promise<void> {
	const sql = `INSERT INTO ${tableName} (id, name, description, genre, numberAvailable) VALUES (?, ?, ?, ?, ?)`;
	const params = [book.id, book.name, book.description, book.genre, book.numberAvailable];

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