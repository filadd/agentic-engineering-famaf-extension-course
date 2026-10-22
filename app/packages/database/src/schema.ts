import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  avatar: text("avatar"),
  role: text("role", { enum: ["teacher", "student"] }).notNull(),
  hasAccess: integer("has_access", { mode: "boolean" }).notNull(),
});

// Enrollment codes and magic link codes share the table. A user has at most
// one link code, and only one enrollment code is current: the one not deleted.
export const codes = sqliteTable(
  "codes",
  {
    id: text("id").primaryKey(),
    type: text("type", { enum: ["user", "enrollment"] }).notNull(),
    code: text("code").notNull().unique(),
    userId: text("user_id").references(() => users.id),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    uniqueIndex("codes_user_id_unique").on(table.userId),
    uniqueIndex("codes_current_enrollment_unique")
      .on(table.type)
      .where(sql`${table.type} = 'enrollment' and ${table.deletedAt} is null`),
  ],
);

// Positions are unique among the sessions not deleted: a deleted session keeps
// its row and its old position.
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    position: integer("position").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    enabled: integer("enabled", { mode: "boolean" }).notNull().default(false),
    currentSlide: integer("current_slide").notNull().default(1),
    currentStep: integer("current_step").notNull().default(1),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  },
  (table) => [
    uniqueIndex("sessions_position_unique")
      .on(table.position)
      .where(sql`${table.deletedAt} is null`),
  ],
);

// The file lives in R2 under `materials/<id>`. A session has at most one
// material marked as slides.
export const materials = sqliteTable(
  "materials",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    name: text("name").notNull(),
    isSlides: integer("is_slides", { mode: "boolean" }).notNull(),
    size: integer("size").notNull(),
    contentType: text("content_type").notNull(),
  },
  (table) => [
    index("materials_session_id_index").on(table.sessionId),
    uniqueIndex("materials_slides_unique")
      .on(table.sessionId)
      .where(sql`${table.isSlides} = 1`),
  ],
);

export const polls = sqliteTable(
  "polls",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    type: text("type", { enum: ["choice", "words", "scale"] }).notNull(),
    status: text("status", { enum: ["draft", "active", "closed"] }).notNull(),
    prompt: text("prompt").notNull(),
    options: text("options", { mode: "json" }).$type<ReadonlyArray<string>>(),
    scaleMinLabel: text("scale_min_label"),
    scaleMaxLabel: text("scale_max_label"),
    deletedAt: integer("deleted_at", { mode: "timestamp_ms" }),
  },
  (table) => [index("polls_session_id_index").on(table.sessionId)],
);

// One response per student and poll; `value` holds the ResponseValue as JSON.
export const responses = sqliteTable(
  "responses",
  {
    id: text("id").primaryKey(),
    pollId: text("poll_id")
      .notNull()
      .references(() => polls.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    value: text("value", { mode: "json" }).notNull(),
  },
  (table) => [uniqueIndex("responses_poll_id_user_id_unique").on(table.pollId, table.userId)],
);

export const questions = sqliteTable(
  "questions",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    authorId: text("author_id")
      .notNull()
      .references(() => users.id),
    body: text("body").notNull(),
    answered: integer("answered", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [index("questions_session_id_index").on(table.sessionId)],
);

export const questionVotes = sqliteTable(
  "question_votes",
  {
    id: text("id").primaryKey(),
    questionId: text("question_id")
      .notNull()
      .references(() => questions.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    uniqueIndex("question_votes_question_id_user_id_unique").on(table.questionId, table.userId),
  ],
);

export const raisedHands = sqliteTable(
  "raised_hands",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
  },
  (table) => [
    uniqueIndex("raised_hands_session_id_user_id_unique").on(table.sessionId, table.userId),
  ],
);

// What changed in a session that the teacher has not announced yet. `entity_id`
// points to a session, a material or a poll depending on `type`, so it is not a
// foreign key; there is at most one entry per type and entity.
export const changelogEntries = sqliteTable(
  "changelog_entries",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id")
      .notNull()
      .references(() => sessions.id),
    type: text("type", { enum: ["session-enabled", "material-added", "poll-opened"] }).notNull(),
    entityId: text("entity_id").notNull(),
    name: text("name").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(cast(unixepoch('subsec') * 1000 as integer))`),
  },
  (table) => [
    uniqueIndex("changelog_entries_type_entity_id_unique").on(table.type, table.entityId),
    index("changelog_entries_session_id_index").on(table.sessionId),
  ],
);
