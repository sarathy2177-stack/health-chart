import { integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified').notNull().default(0),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const profile = pgTable('profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  username: text('username').notNull(),
  usernameNormalized: text('usernameNormalized').notNull().unique(),
  firstName: text('firstName').notNull(),
  lastName: text('lastName').notNull(),
  age: integer('age'),
  gender: text('gender'),
  height: numeric('height'),
  heightUnit: text('heightUnit'),
  weight: numeric('weight'),
  weightUnit: text('weightUnit'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
