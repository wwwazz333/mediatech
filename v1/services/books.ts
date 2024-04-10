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



///Get all books by name
///return the books found (that contains the name)
export async function getByName(name: string): Promise<Book[]> {
	const sql = `SELECT * FROM ${tableName} WHERE LOWER(name) LIKE '%' || LOWER(?) || '%'`;
	const params = [name];

	const rows = await new Promise((resolve, reject) => {
		database.all(sql, params, (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});

	if (rows) {
		try {
			const books = z.array(bookSchema).parse(rows);
			return books;
		} catch (e: any) {
			console.log("row", rows)
			throw new Error("Error parsing book from BDD : " + e.message);
		}
	} else {
		throw new Error(`Book with name ${name} not found`);
	}
}

//Get all books by genre
///return the books found (that contains the genre)
export async function getByGenre(genre: string): Promise<Book[]> {
	const sql = `SELECT * FROM ${tableName} WHERE LOWER(genre) LIKE '%' || LOWER(?) || '%'`;
	const params = [genre];

	const row = await new Promise((resolve, reject) => {
		database.all(sql, params, (err, row) => {
			if (err) {
				reject(err);
			} else {
				resolve(row);
			}
		});
	});

	if (row) {
		try {
			const books = z.array(bookSchema).parse(row);
			return books;
		} catch (e: any) {
			throw new Error("Error parsing book from BDD : " + e.message);
		}
	} else {
		throw new Error(`Book with genre ${genre} not found`);
	}
}

///Get all books by author name
///return the books found (that contains the author name)
export async function getByAuthor(nameAuthor: string): Promise<Book[]> {
	const sql = `SELECT * FROM ${tableName} as B, Written as W, Author as A WHERE B.id = W.idBook AND W.idAuthor = A.id AND LOWER(A.name) LIKE '%' || LOWER(?) || '%'`;
	const params = [nameAuthor];

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
			const books = z.array(bookSchema).parse(rows);
			return books;
		} catch (e: any) {
			throw new Error("Error parsing books from BDD : " + e.message);
		}
	} else {
		throw new Error(`Book with author ${nameAuthor} not found`);
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