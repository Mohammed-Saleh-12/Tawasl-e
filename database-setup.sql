-- Tawasl Database Setup Script
-- Run this script to create the database and initial schema

-- Create database (run this as a PostgreSQL superuser)
-- CREATE DATABASE tawasl;

-- Connect to the tawasl database and run the following:

-- Enable UUID extension (optional, for future use)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The database schema will be automatically created when you run:
-- npm run db:push

-- This script creates the following tables:
-- 1. users - User accounts and authentication
-- 2. articles - Educational content library
-- 3. test_categories - Different types of communication tests
-- 4. test_questions - Individual questions for each test category
-- 5. test_results - User test completion records and scores
-- 6. faqs - Frequently asked questions
-- 7. video_analyses - Video analysis results with AI feedback

-- Sample data will be automatically seeded when the application starts
-- The seed data includes:
-- - 5 comprehensive articles on communication skills
-- - 3 test categories with 15 total questions
-- - 8 detailed FAQ entries

-- To verify the setup, run these queries after starting the application:
-- SELECT COUNT(*) FROM articles; -- Should return 5
-- SELECT COUNT(*) FROM test_questions; -- Should return 15
-- SELECT COUNT(*) FROM faqs; -- Should return 8