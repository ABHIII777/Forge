import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: serial("user_id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull().unique()
})
