import { z } from "zod";


export interface Author {
	id: number;
	name: string;
}


export const authorSchema = z.object({
	id: z.number(),
	name: z.string()
})
