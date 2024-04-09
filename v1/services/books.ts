import { z } from "zod";
import { Book, bookSchema } from "../models/books";
import database from "./database";



export async function getAll(): Promise<Book[]> {
	const sql = `SELECT * FROM books`;

	//instead of using a callback, we use a promise
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
		const books = z.array(bookSchema).parse(rows);

		return books;
	} catch (e) {
		console.error("Error parsing books");
		return [];
	}
}

//Create a book
export async function create(book: Book): Promise<void> {
	const sql = `INSERT INTO books (id, name, description, genre, numberAvailable) VALUES (?, ?, ?, ?, ?)`;
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