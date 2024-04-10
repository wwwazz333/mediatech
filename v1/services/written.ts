import { z } from "zod";
import { Written, writtenSchema } from "../models/written";
import database from "./database";





const tableName = "Written";

///Get all written
///return all written found
export async function getAll(): Promise<Written[]> {
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
		const written = z.array(writtenSchema).parse(rows);

		return written;
	} catch (e: any) {
		throw new Error("Error parsing writtens from BDD : " + e.message);
	}
}

///Get a written by idBook and idAuthor
///return the written found
export async function getByIdBookAndIdAuthor(idBook: number, idAuthor: number): Promise<Written> {
	const sql = `SELECT * FROM ${tableName} WHERE idBook = ? AND idAuthor = ?`;
	const params = [idBook, idAuthor];

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
			const written = writtenSchema.parse(row);
			return written;
		} catch (e: any) {
			throw new Error("Error parsing written from BDD : " + e.message);
		}
	} else {
		throw new Error(`Written with idBook ${idBook} and idAuthor ${idAuthor} not found`);
	}
}


///Create a written
///return the created written
export async function create(written: Written): Promise<Written> {
	const sql = `INSERT INTO ${tableName} (publication, idBook, idAuthor) VALUES (?, ?, ?)`;
	const params = [written.publication.toISOString(), written.idBook, written.idAuthor];

	return await new Promise((resolve, reject) => {
		database.run(sql, params, async (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(await getByIdBookAndIdAuthor(written.idBook, written.idAuthor));
			}
		});
	});

}

///Delete a written
///return the deleted written
export async function remove(idBook: number, idAuthor: number): Promise<Written> {
	const sql = `DELETE FROM ${tableName} WHERE idBook = ? AND idAuthor = ?`;
	const params = [idBook, idAuthor];

	const written = await getByIdBookAndIdAuthor(idBook, idAuthor);

	return await new Promise((resolve, reject) => {
		database.run(sql, params, async (err) => {
			if (err) {
				reject(err);
			} else {
				resolve(written);
			}
		});
	});
}
