import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { Router } from 'express';
import { storage } from './storage';
import { analyzeVideoWithAI } from './ai-video-analysis';
import nodemailer from "nodemailer";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { users } from "@shared/schema";
import { db } from "./db";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Extend session interface
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

const router = Router();

// Zod schemas for input validation
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const articleSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  category: z.string().optional(),
  author: z.string().optional(),
  readTime: z.number().optional(),
  imageUrl: z.string().url().optional(),
});

const testResultSchema = z.object({
  categoryId: z.number(),
  score: z.number(),
  answers: z.array(z.any()),
});

// Helper: generate random 6-digit code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: send email
async function sendVerificationEmail(to: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
    html: `<p>Your verification code is: <b>${code}</b></p>`
  });
}

// --- AUTH ROUTES ---
router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid registration data', details: parsed.error.errors });
    }
    const { username, email, password } = parsed.data;
    const [existing] = await db.select().from(users).where(eq(users.email, email));
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const code = generateVerificationCode();
    await db.insert(users).values({ username, email, password: hashed, verified: false, verification_code: code }).returning();
    await sendVerificationEmail(email, code);
    res.status(201).json({ message: 'Verification code sent to email.' });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: (err as Error).message });
  }
});

router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code required' });
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verified) return res.status(400).json({ error: 'Already verified' });
    if (user.verification_code !== code) return res.status(400).json({ error: 'Invalid code' });
    await db.update(users).set({ verified: true, verification_code: null }).where(eq(users.email, email));
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed', details: (err as Error).message });
  }
});

// Update login to only allow verified users
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return done(null, false, { message: 'Incorrect email.' });
    if (!user.verified) return done(null, false, { message: 'Please verify your email before logging in.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// In GoogleStrategy, set verified: true if new user
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: "/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(null, false, { message: 'No email from Google.' });
    let [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      const username = profile.displayName || email.split('@')[0];
      const [newUser] = await db.insert(users).values({
        username,
        email,
        password: '',
        verified: true,
        verification_code: null
      }).returning();
      user = newUser;
    } else if (!user.verified) {
      await db.update(users).set({ verified: true, verification_code: null }).where(eq(users.email, email));
      user.verified = true;
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Health check endpoint
router.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
});

// Test session endpoint for development
router.get('/test-session', (req, res) => {
  try {
  console.log('🧪 Test session - Session data:', req.session);
  res.json({ 
    session: req.session,
    hasUserId: !!req.session.userId,
    userId: req.session.userId,
    environment: process.env.NODE_ENV
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Test session error:', error);
    res.status(500).json({ error: 'Session test failed', details: error.message });
  }
});

// Simple test endpoint
router.get('/test', (req, res) => {
  try {
    res.json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: 'Test endpoint failed', details: error.message });
  }
});

// GET /api/articles
router.get('/articles', async (req, res) => {
  try {
    const { category, search } = req.query;
    const articles = await storage.getArticles(search as string | undefined, category as string | undefined);
    res.json(articles);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles', details: error.message });
  }
});

// GET /api/tests
router.get('/tests', async (req, res) => {
  try {
    const tests = await storage.getAllTestQuestions();
    res.json(tests);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching tests:', error);
    res.status(500).json({ error: 'Failed to fetch tests', details: error.message });
  }
});

// GET /api/faqs
router.get('/faqs', async (req, res) => {
  try {
    const { category, search } = req.query;
    const faqs = await storage.getFAQs(search as string | undefined, category as string | undefined);
    res.json(faqs);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching faqs:', error);
    res.status(500).json({ error: 'Failed to fetch faqs', details: error.message });
  }
});

// PUT /api/faqs/:id
router.put('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined' || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid FAQ ID' });
  }
  try {
    const updatedFaq = await storage.updateFAQ(Number(id), req.body);
    res.json(updatedFaq);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Failed to update FAQ', details: error.message });
  }
});

// GET /api/test-categories
router.get('/test-categories', async (req, res) => {
  try {
    const categories = await storage.getTestCategories();
    res.json(categories);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching test categories:', error);
    res.status(500).json({ error: 'Failed to fetch test categories', details: error.message });
  }
});

// GET /api/test-questions
router.get('/test-questions', async (req, res) => {
  try {
    const questions = await storage.getAllTestQuestions();
    res.json(questions);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching test questions:', error);
    res.status(500).json({ error: 'Failed to fetch test questions', details: error.message });
  }
});

// GET /api/test-questions/:categoryId
router.get('/test-questions/:categoryId', async (req, res) => {
  try {
    const questions = await storage.getTestQuestions(Number(req.params.categoryId));
    res.json({ questions });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching test questions for category:', error);
    res.status(500).json({ error: 'Failed to fetch test questions for category', details: error.message });
  }
});

// GET /api/test-categories/:id/questions
router.get('/test-categories/:id/questions', async (req, res) => {
  try {
    const questions = await storage.getTestQuestions(Number(req.params.id));
    res.json({ questions });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching test questions for category:', error);
    res.status(500).json({ error: 'Failed to fetch test questions for category', details: error.message });
  }
});

// --- ARTICLES CRUD ---
// POST /api/articles
router.post('/articles', async (req, res) => {
  try {
    const parsed = articleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid article data', details: parsed.error.errors });
    }
    // Always set publishedAt
    const now = new Date();
    const articleData = {
      ...parsed.data,
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : now,
      category: parsed.data.category || 'General',
      author: parsed.data.author || 'Unknown',
      readTime: parsed.data.readTime || 1,
    };
    const newArticle = await storage.createArticle(articleData);
    res.status(201).json(newArticle);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article', details: error.message });
  }
});
// PUT /api/articles/:id
router.put('/articles/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid article ID' });
  }
  try {
    const parsed = articleSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid article data', details: parsed.error.errors });
    }
    // Fetch existing article to merge fields
    const existing = await storage.getArticle(Number(id));
    if (!existing) return res.status(404).json({ error: 'Article not found' });
    const updateData = {
      ...existing,
      ...parsed.data,
      publishedAt: req.body.publishedAt ? new Date(req.body.publishedAt) : existing.publishedAt || new Date(),
      category: parsed.data.category || existing.category || 'General',
      author: parsed.data.author || existing.author || 'Unknown',
      readTime: parsed.data.readTime || existing.readTime || 1,
    };
    const updatedArticle = await storage.updateArticle(Number(id), updateData);
    res.json(updatedArticle);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article', details: error.message });
  }
});
// DELETE /api/articles/:id
router.delete('/articles/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid article ID' });
  }
  try {
    await storage.deleteArticle(Number(id));
    res.status(204).end();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error deleting article:', error);
    res.status(500).json({ error: 'Failed to delete article', details: error.message });
  }
});
// --- FAQ CRUD ---
// POST /api/faqs
router.post('/faqs', async (req, res) => {
  try {
    const { question, answer, category } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }
    const newFaq = await storage.createFAQ({ question, answer, category });
    res.status(201).json(newFaq);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Failed to create FAQ', details: error.message });
  }
});
// DELETE /api/faqs/:id
router.delete('/faqs/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid FAQ ID' });
  }
  try {
    await storage.deleteFAQ(Number(id));
    res.status(204).end();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Failed to delete FAQ', details: error.message });
  }
});
// --- TEST CATEGORY CRUD ---
// POST /api/test-categories
router.post('/test-categories', async (req, res) => {
  try {
    const { name, description, duration, questionCount, color, icon } = req.body;
    if (!name || !description || !duration || !questionCount || !color || !icon) {
      return res.status(400).json({ error: 'All fields are required: name, description, duration, questionCount, color, icon' });
    }
    const newCategory = await storage.createTestCategory({ name, description, duration, questionCount, color, icon });
    res.status(201).json(newCategory);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error creating test category:', error);
    res.status(500).json({ error: 'Failed to create test category', details: error.message });
  }
});
// PUT /api/test-categories/:id
router.put('/test-categories/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid test category ID' });
  }
  try {
    const { name, description, duration, questionCount, color, icon } = req.body;
    if (!name || !description || !duration || !questionCount || !color || !icon) {
      return res.status(400).json({ error: 'All fields are required: name, description, duration, questionCount, color, icon' });
    }
    const updatedCategory = await storage.updateTestCategory(Number(id), { name, description, duration, questionCount, color, icon });
    res.json(updatedCategory);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error updating test category:', error);
    res.status(500).json({ error: 'Failed to update test category', details: error.message });
  }
});
// DELETE /api/test-categories/:id
router.delete('/test-categories/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid test category ID' });
  }
  try {
    await storage.deleteTestCategory(Number(id));
    res.status(204).end();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error deleting test category:', error);
    res.status(500).json({ error: 'Failed to delete test category', details: error.message });
  }
});
// --- TEST QUESTION CRUD ---
// POST /api/test-questions
router.post('/test-questions', async (req, res) => {
  try {
    const { question, options, correctAnswer, categoryId, explanation } = req.body;
    // Validate options: must be an array with at least 2 non-empty strings
    if (!question || !options || !correctAnswer || !categoryId) {
      return res.status(400).json({ error: 'All fields are required: question, options, correctAnswer, categoryId' });
    }
    if (!Array.isArray(options) || options.filter(opt => typeof opt === 'string' && opt.trim() !== '').length < 2) {
      return res.status(400).json({ error: 'Options must be an array with at least 2 non-empty strings.' });
    }
    const filteredOptions = options.filter(opt => typeof opt === 'string' && opt.trim() !== '');
    const newQuestion = await storage.createTestQuestion({ question, options: filteredOptions, correctAnswer, categoryId, explanation });
    res.status(201).json(newQuestion);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error creating test question:', error);
    res.status(500).json({ error: 'Failed to create test question', details: error.message });
  }
});
// PUT /api/test-questions/:id
router.put('/test-questions/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid test question ID' });
  }
  try {
    const { question, options, correctAnswer, categoryId, explanation } = req.body;
    if (!question || !options || !correctAnswer || !categoryId) {
      return res.status(400).json({ error: 'All fields are required: question, options, correctAnswer, categoryId' });
    }
    const updatedQuestion = await storage.updateTestQuestion(Number(id), { question, options, correctAnswer, categoryId, explanation });
    res.json(updatedQuestion);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error updating test question:', error);
    res.status(500).json({ error: 'Failed to update test question', details: error.message });
  }
});
// DELETE /api/test-questions/:id
router.delete('/test-questions/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid test question ID' });
  }
  try {
    await storage.deleteTestQuestion(Number(id));
    res.status(204).end();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error deleting test question:', error);
    res.status(500).json({ error: 'Failed to delete test question', details: error.message });
  }
});

// --- TEST RESULTS CRUD ---
// POST /api/test-results

  router.post('/test-results', async (req, res) => {
  console.log('POST /api/test-results called with body:', req.body);
  try {
    const { categoryId, score, totalQuestions, answers, feedback } = req.body;
    if (!categoryId || typeof score !== 'number' || !totalQuestions || !answers) {
      console.log('Validation failed:', { categoryId, score, totalQuestions, answers });
      return res.status(400).json({ error: 'All fields are required: categoryId, score, totalQuestions, answers' });
    }
    console.log('Creating test result with data:', { categoryId, score, totalQuestions, answers, feedback });
    
    // Log the exact data being passed to createTestResult
    const testResultData = { 
      categoryId, 
      score, 
      totalQuestions, 
      answers, 
      feedback: feedback || '',
      userId: 0 // Default user ID for now
    };
    console.log('Test result data to be inserted:', testResultData);
    
    const newResult = await storage.createTestResult(testResultData);
    console.log('Test result created successfully:', newResult);
    res.status(201).json(newResult);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error creating test result:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create test result', 
      details: error.message,
      stack: error.stack 
    });
  }
});

// GET /api/test-results
router.get('/test-results', async (req, res) => {
  console.log('GET /api/test-results called');
  try {
    const results = await storage.getUserTestResults(0); // Default user ID for now
    console.log('Test results fetched successfully:', results);
    res.json({ results });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error fetching test results:', error);
    res.status(500).json({ error: 'Failed to fetch test results', details: error.message });
  }
});

// DELETE /api/test-results/:id
router.delete('/test-results/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid test result ID' });
  }
  try {
    await storage.deleteTestResult(Number(id));
    res.status(204).end();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error deleting test result:', error);
    res.status(500).json({ error: 'Failed to delete test result', details: error.message });
  }
});

// POST /api/video-analyses
router.post('/video-analyses', async (req, res) => {
  try {
    const { videoData, scenario, duration, videoMimeType } = req.body;
    if (!videoData || !scenario || typeof duration === 'undefined') {
      return res.status(400).json({ error: 'Missing videoData, scenario, or duration' });
    }
    const videoBuffer = Buffer.from(videoData, 'base64');
    const analysis = await analyzeVideoWithAI(videoBuffer, scenario, duration, videoMimeType);
    res.json({ analysis });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Error analyzing video:', error);
    res.status(500).json({ error: 'Failed to analyze video', details: error.message });
  }
});

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: true,
}), (req, res) => {
  // Successful authentication, redirect to home page
  res.redirect('/');
});

export function registerRoutes(app: Express): Promise<Server> {
  return new Promise((resolve) => {
    app.use('/api', router);
    
    const server = createServer(app);
    resolve(server);
  });
}
