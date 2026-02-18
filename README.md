# Smart Bookmark App

This is a simple real-time bookmark manager built using Next.js (App Router), Supabase, and Tailwind CSS.

The goal of this project was to build a minimal but production-ready application where:

- Users log in using Google OAuth (no email/password)
- Each user manages their own private bookmarks
- Bookmarks update instantly across multiple tabs
- The app is deployed and accessible via a live URL

Live URL: https://smart-bookmarks-app-onth.vercel.app
GitHub Repo:https://github.com/nityamsoni/Smart-Bookmarks-app

---

## Features

- Google OAuth authentication
- Add bookmark (title + URL)
- Delete bookmark
- Private per-user data using Row Level Security
- Real-time updates using Supabase Realtime
- Fully deployed on Vercel

---

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, PostgreSQL, Realtime)
- Tailwind CSS
- Vercel

---

# Challenges I Faced & How I Solved Them

## 1. Supabase Was Completely New to Me

Coming from a more traditional backend understanding, Supabase’s architecture was different than what I was used to.

The biggest adjustment was understanding:

- How authentication connects directly to the database
- How `auth.uid()` works inside policies
- Why enabling Row Level Security (RLS) blocks everything by default

Initially, my queries were returning empty results and inserts were failing silently. After reviewing Supabase documentation and checking policies, I realized that RLS was enabled but no policies were defined.

Once I created proper SELECT, INSERT, and DELETE policies using:

### 2. Google OAuth Redirecting to localhost After Deployment

**Problem:**  
After deploying to Vercel, Google login kept redirecting to `http://localhost:3000`.

**What Happened:**  
Supabase’s “Site URL” was still set to localhost.

**Fix:**  
I updated:
Supabase → Authentication → URL Configuration
---

## 3. Realtime Not Updating Across Tabs

One of the main requirements was real-time updates. Initially, bookmarks were being inserted into the database correctly, but they were not updating in other browser tabs.

The issues were:

- Realtime was not enabled for the bookmarks table
- The subscription to `postgres_changes` was not correctly configured
- RLS policies also affect realtime queries

After:

- Enabling Realtime for the table in Supabase
- Confirming SELECT policies allowed access
- Properly subscribing to database changes

real-time updates started working as expected.

This helped me understand how realtime systems depend heavily on database permissions and correct configuration.

---
