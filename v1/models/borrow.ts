import { z } from "zod";

export interface Borrow {
	idBook: number;
	idUser: number;
}


export const borrowSchema = z.object({
	idBook: z.number(),
	idUser: z.number()
})
