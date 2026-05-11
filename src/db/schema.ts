import { pgTable, uuid, text, integer, numeric, boolean, timestamp } from 'drizzle-orm/pg-core';

export const exercises = pgTable('exercises', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const workouts = pgTable('workouts', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id').notNull(),
    name: text('name'),
    startedAt: timestamp('started_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
});

export const workoutExercises = pgTable('workout_exercises', {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutId: uuid('workout_id').notNull().references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: uuid('exercise_id').notNull().references(() => exercises.id),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const sets = pgTable('sets', {
    id: uuid('id').primaryKey().defaultRandom(),
    workoutExerciseId: uuid('workout_exercise_id').notNull().references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    weight: numeric('weight', { precision: 8, scale: 2 }),
    weightUnit: text('weight_unit').notNull().default('lbs'),
    completed: boolean('completed').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
