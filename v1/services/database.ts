import sqlite3 from 'sqlite3';

sqlite3.verbose();

const dbName = "database.db";

const db = new sqlite3.Database(dbName, (err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.info('Connected to the database.');
		db.run(`
		CREATE TABLE IF NOT EXISTS "Book" (
			"id" INTEGER NOT NULL UNIQUE,
			"name" TEXT,
			"description" TEXT NOT NULL,
			"genre" TEXT NOT NULL,
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
			"name" TEXT,
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
			"name" TEXT,
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
			"publication" TEXT UNIQUE,
			"idBook" INTEGER,
			"idAuthor" INTEGER,
			PRIMARY KEY("idBook", "idAuthor"),
			FOREIGN KEY ("idBook") REFERENCES "Book"("id")
			ON UPDATE NO ACTION ON DELETE NO ACTION
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
			"idBook" INTEGER UNIQUE,
			"idUser" INTEGER,
			PRIMARY KEY("idBook", "idUser"),
			FOREIGN KEY ("idBook") REFERENCES "Book"("id")
			ON UPDATE NO ACTION ON DELETE NO ACTION
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