import { pgTable, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const userSystemEnum = pgEnum("user_system_enum", ['system', 'user'])



