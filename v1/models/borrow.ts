import { z } from "zod";

export interface Borrow {
	idBook: number;
	idUser: number;
	dateBorrow: Date;
}


export const borrowSchema = z.object({
	idBook: z.number(),
	idUser: z.number(),
	dateBorrow: z.string().transform((str) => {
		return new Date(str)
	}).or(z.date()),
})

export interface BorrowSearch {
	idBook?: number | null,
	idUser?: number | null,
	dateBorrow?: Date | null
}

export const borrowSearchSchema = z.object({
	idBook: z.number().optional().nullable(),
	idUser: z.number().optional().nullable(),
	dateBorrow: z.string().optional().nullable().transform((str) => {
		if (str) {
			return new Date(str)
		} else {
			return null;
		}
	}).or(z.date().optional().nullable()),
})
