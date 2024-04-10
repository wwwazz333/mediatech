import { z } from "zod";
import { Borrow, borrowSchema } from "../models/borrow";
import database from "./database";

const tableName = "Borrow";

///Get all borrows
export async function getAll(): Promise<Borrow[]> {
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
	if (rows) {
		try {
			console.debug("rows", rows)
			const borrows = z.array(borrowSchema).parse(rows);

			return borrows;
		} catch (e: any) {
			console.error("Error parsing borrows from BDD");
			throw new Error("Error parsing borrows from BDD : " + e.message);
		}
	} else {
		throw new Error("No borrows found");
	}
}

///get all borrow by user id
export async function getByUserId(id: number): Promise<Borrow[]> {
	const sql = `SELECT * FROM ${tableName} WHERE idUser = ?`;
	const params = [id];

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
		console.debug("rows", rows)
		const borrows = z.array(borrowSchema).parse(rows);

		return borrows;
	} catch (e: any) {
		throw new Error("Error parsing borrows from BDD");
	}
}

///Get a borrow by idUser and idBook
export async function getByIdUserAndIdBook(idUser: number, idBook: number): Promise<Borrow> {
	const sql = `SELECT * FROM ${tableName} WHERE idUser = ? AND idBook = ?`;
	const params = [idUser, idBook];

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
			const borrow = borrowSchema.parse(row);
			return borrow;
		} catch (e: any) {
			throw new Error("Error parsing borrow from BDD");
		}
	} else {
		throw new Error(`Borrow with idUser ${idUser} and idBook ${idBook} not found`);
	}
}

///Get all borrows by book id
export async function getByBookId(id: number): Promise<Borrow[]> {
	const sql = `SELECT * FROM ${tableName} WHERE idBook = ?`;
	const params = [id];

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
			console.debug("rows", rows)
			const borrows = z.array(borrowSchema).parse(rows);

			return borrows;
		} catch (e: any) {
			throw new Error("Error parsing borrows from BDD : " + e.message);
		}
	} else {
		throw new Error("No borrows found");
	}
}


///Create a borrow
export async function create(borrow: Borrow): Promise<Borrow> {
	const sql = `INSERT INTO ${tableName} (idUser, idBook, dateBorrow) VALUES (?, ?, ?)`;
	const params = [borrow.idUser, borrow.idBook, borrow.dateBorrow.toISOString()];

	await new Promise((resolve, reject) => {
		database.run(sql, params, async function (err) {
			if (err) {
				reject(err);
			} else {
				resolve(await getByIdUserAndIdBook(borrow.idUser, borrow.idBook));
			}
		});
	});

	return borrow;
}


///Delete a borrow by idUser and idBook
export async function remove(idUser: number, idBook: number): Promise<Borrow> {
	const sql = `DELETE FROM ${tableName} WHERE idUser = ? AND idBook = ?`;
	const params = [idUser, idBook];

	try {
		const previous = await getByIdUserAndIdBook(idUser, idBook);
		return await new Promise((resolve, reject) => {
			database.run(sql, params, function (err) {
				if (err) {
					reject(err);
				} else {
					resolve(previous);
				}
			});
		});
	} catch (e) {
		throw new Error(`Borrow with idUser ${idUser} and idBook ${idBook} not found`);
	}
}