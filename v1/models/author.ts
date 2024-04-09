import { z } from "zod";


export interface Author {
	id?: number | null;
	name: string;
}


export const authorSchema = z.object({
	id: z.number().optional().nullable(),
	name: z.string()
})
