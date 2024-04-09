
import { z } from "zod";

export interface Book {
	id: number;
	name: string;
	description?: string;
	genre?: string;
	numberAvailable: number;
}


// Define a schema for the book object to check constraintes
export const bookSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	genre: z.string().optional(),
	numberAvailable: z.number().positive("Number of books available must be positive")
})
