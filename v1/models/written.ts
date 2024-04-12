import { z } from "zod";


export interface Written {
	idBook: number;
	idAuthor: number;
	publication: Date;
}


export const writtenSchema = z.object({
	idBook: z.number(),
	idAuthor: z.number(),
	publication: z.string().transform((str) => {
		return new Date(str)
	}).or(z.date())
})

export interface WrittenSearch {
	idBook?: number | null,
	idAuthor?: number | null,
	publication?: Date | null
}

export const writtenSearchSchema = z.object({
	idBook: z.number().optional().nullable(),
	idAuthor: z.number().optional().nullable(),
	publication: z.string().optional().nullable().transform((str) => {
		if (str) {
			return new Date(str)
		} else {
			return null;
		}
	}).or(z.date().optional().nullable())
})