import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
  verified: boolean("verified").notNull().default(false),
  verification_code: text("verification_code"),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  publishedAt: timestamp("published_at").notNull(),
  readTime: integer("read_time").notNull(),
  imageUrl: text("image_url"),
});

export const testCategories = pgTable("test_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  questionCount: integer("question_count").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
});

export const testQuestions = pgTable("test_questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  question: text("question").notNull(),
  options: jsonb("options").notNull().$type<string[]>(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  categoryId: integer("category_id").notNull(),
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  answers: jsonb("answers").notNull().$type<Record<string, string>>(),
  feedback: text("feedback"),
  completedAt: timestamp("completed_at").notNull(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull(),
});

export const videoAnalyses = pgTable("video_analyses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  scenario: text("scenario").notNull(),
  overallScore: integer("overall_score").notNull(),
  eyeContactScore: integer("eye_contact_score").notNull(),
  facialExpressionScore: integer("facial_expression_score").notNull(),
  gestureScore: integer("gesture_score").notNull(),
  postureScore: integer("posture_score").notNull(),
  feedback: jsonb("feedback").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
});

export const insertTestCategorySchema = createInsertSchema(testCategories).omit({
  id: true,
});

export const insertTestQuestionSchema = createInsertSchema(testQuestions).omit({
  id: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  completedAt: true,
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
});

export const insertVideoAnalysisSchema = createInsertSchema(videoAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type TestCategory = typeof testCategories.$inferSelect;
export type TestQuestion = typeof testQuestions.$inferSelect;
export type TestResult = typeof testResults.$inferSelect;
export type FAQ = typeof faqs.$inferSelect;
export type VideoAnalysis = typeof videoAnalyses.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type InsertTestCategory = z.infer<typeof insertTestCategorySchema>;
export type InsertTestQuestion = z.infer<typeof insertTestQuestionSchema>;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type InsertFAQ = z.infer<typeof insertFaqSchema>;
export type InsertVideoAnalysis = z.infer<typeof insertVideoAnalysisSchema>;
