import { z } from "zod";


export interface User {
	id: number;
	name: string;
}

export const userSchema = z.object({
	id: z.number(),
	name: z.string()
})
