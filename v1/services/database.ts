import sqlite3 from 'sqlite3';

sqlite3.verbose();

const dbName = "database.db";

const db = new sqlite3.Database(dbName, (err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.info('Connected to the database.');
		db.run(`
		PRAGMA foreign_keys = ON;
		`, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.debug('Foreign key constraints activated');
			}
		});
		db.run(`
		CREATE TABLE IF NOT EXISTS "Book" (
			"id" INTEGER NOT NULL UNIQUE,
			"name" TEXT NOT NULL,
			"description" TEXT,
			"genre" TEXT,
			"numberAvailable" INTEGER DEFAULT 0 CHECK(numberAvailable>=0),
			PRIMARY KEY("id")	
		);
		`, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.debug('Table Book created.');
			}
		});
		db.run(`
		CREATE TABLE IF NOT EXISTS "Author" (
			"id" INTEGER NOT NULL UNIQUE,
			"name" TEXT NOT NULL,
			PRIMARY KEY("id")	
		);
		`, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.debug('Table Author created.');
			}
		});
		db.run(`
		CREATE TABLE IF NOT EXISTS "User" (
			"id" INTEGER NOT NULL UNIQUE,
			"name" TEXT NOT NULL,
			PRIMARY KEY("id")	
		);
		`, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.debug('Table User created.');
			}
		});
		db.run(`
		CREATE TABLE IF NOT EXISTS "Written" (
			"publication" TEXT NOT NULL UNIQUE,
			"idBook" INTEGER NOT NULL,
			"idAuthor" INTEGER NOT NULL,
			PRIMARY KEY("idBook", "idAuthor"),
			FOREIGN KEY ("idBook") REFERENCES "Book"("id"),
			FOREIGN KEY ("idAuthor") REFERENCES "Author"("id")
		);
		`, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.debug('Table Written created.');
			}
		});
		db.run(`
		CREATE TABLE IF NOT EXISTS "Borrow" (
			"idBook" INTEGER NOT NULL UNIQUE,
			"idUser" INTEGER NOT NULL,
			"dateBorrow" TEXT NOT NULL,
			PRIMARY KEY("idBook", "idUser"),
			FOREIGN KEY ("idBook") REFERENCES "Book"("id"),
			FOREIGN KEY ("idUser") REFERENCES "User"("id")
		);
		
		`, (err) => {
			if (err) {
				console.error(err.message);
			} else {
				console.debug('Table Borrow created.');
			}
		});
	}
});


export default db;