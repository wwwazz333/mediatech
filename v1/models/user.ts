import { z } from "zod";


export interface User {
	id: number;
	name: string;
}

export const userSchema = z.object({
	id: z.number(),
	name: z.string()
})

export interface UserSearch {
	id?: number | null,
	name?: string | null
}

export const userSearchSchema = z.object({
	id: z.number().optional().nullable(),
	name: z.string().optional().nullable()
})