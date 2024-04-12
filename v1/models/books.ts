
import { z } from "zod";

export interface Book {
	id?: number | null;
	name: string;
	description?: string | null;
	genre?: string | null;
	numberAvailable: number;
}


// Define a schema for the book object to check constraintes
export const bookSchema = z.object({
	id: z.number().optional().nullable(),
	name: z.string(),
	description: z.string().optional().nullable(),
	genre: z.string().optional().nullable(),
	numberAvailable: z.number().nonnegative("Number of books available must be positive")
})


export interface BookSearch {
	id?: number | null,
	name?: string | null,
	genre?: string | null,
	authorName?: string | null
}

export const bookSearchSchema = z.object({
	id: z.number().optional().nullable(),
	name: z.string().optional().nullable(),
	genre: z.string().optional().nullable(),
	authorName: z.string().optional().nullable()
})