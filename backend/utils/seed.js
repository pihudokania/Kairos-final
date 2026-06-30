// Run with: npm run seed
// Populates MongoDB with the same starting data that was previously
// hardcoded into Kairos_index.html, so the app looks identical on first load.
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('../config/db');
const Mission = require('../models/Mission');
const Achievement = require('../models/Achievement');
const Reflection = require('../models/Reflection');
const UserStats = require('../models/UserStats');

async function seed() {
  await connectDB();

  await Promise.all([
    Mission.deleteMany({}),
    Achievement.deleteMany({}),
    Reflection.deleteMany({}),
    UserStats.deleteMany({})
  ]);

  await Mission.create([
    {
      name: '🔴 React Full-Stack Project',
      description: 'Build a full-stack React app with authentication, dashboard, and API. Deadline: tomorrow 11:59 PM.',
      priority: 'critical',
      status: 'in-progress',
      progress: 58,
      estimatedMinutes: 360,
      missProbability: 81,
      aiScheduled: true,
      subtasks: [
        { name: 'Research & Setup', status: 'done', estimatedMinutes: 45, aiConfidence: 100 },
        { name: 'Create Project Structure', status: 'done', estimatedMinutes: 30, aiConfidence: 100 },
        { name: 'Navbar & Routing', status: 'done', estimatedMinutes: 40, aiConfidence: 100 },
        { name: 'Authentication Module', status: 'active', estimatedMinutes: 75, aiConfidence: 92 },
        { name: 'Dashboard UI', status: 'pending', estimatedMinutes: 90, aiConfidence: 87 },
        { name: 'API Integration', status: 'pending', estimatedMinutes: 135, aiConfidence: 73 },
        { name: 'Testing & Deployment', status: 'pending', estimatedMinutes: 60, aiConfidence: 89 }
      ]
    },
    {
      name: 'Design Systems Assignment',
      description: 'Research phase not started. Due in 38 hours.',
      priority: 'high',
      status: 'pending',
      progress: 0,
      estimatedMinutes: 210,
      missProbability: 62
    }
  ]);

  await Achievement.create([
    { key: 'seven-day-streak', name: 'Seven Day Streak', description: '7 consecutive days of completing at least one mission', icon: '🔥', unlocked: true, unlockedAt: new Date() },
    { key: 'focus-master', name: 'Focus Master', description: '10+ hours of deep focus sessions completed', icon: '⚡', unlocked: true, unlockedAt: new Date() },
    { key: 'deadline-survivor', name: 'Deadline Survivor', description: 'Completed 5 critical missions before the deadline', icon: '🏆', unlocked: true, unlockedAt: new Date() },
    { key: 'mission-commander', name: 'Mission Commander', description: 'Reached Level 12 — top 5% of KAIROS users', icon: '🚀', unlocked: true, unlockedAt: new Date() },
    { key: 'ai-listener', name: 'AI Listener', description: 'Followed 20 AI intervention recommendations', icon: '🧠', unlocked: true, unlockedAt: new Date() },
    { key: 'night-owl', name: 'Night Owl', description: 'Completed 5 missions after 9 PM', icon: '🌙', unlocked: true, unlockedAt: new Date() },
    { key: 'flawless-week', name: 'Flawless Week', description: 'Complete every planned mission in a full 7-day week', icon: '💎', unlocked: false },
    { key: 'perfect-predictor', name: 'Perfect Predictor', description: 'AI time estimate matches within 5% for 10 missions', icon: '🎯', unlocked: false },
    { key: 'momentum-master', name: 'Momentum Master', description: 'Maintain 90%+ momentum for 14 consecutive days', icon: '🌟', unlocked: false }
  ]);

  await Reflection.create([
    {
      date: new Date('2026-07-13T22:47:00'),
      body: "Today you accomplished 3 of 4 planned missions. The fourth — API integration — was postponed twice, matching your pattern of underestimating late-afternoon energy. Your best focus window was 8 PM to 10:30 PM. You tend to procrastinate after lunch (12-2 PM).",
      tags: ['Peak: 8-10 PM', 'Weak: Post-lunch', 'Streak: Day 7', 'Tomorrow adjusted']
    },
    {
      date: new Date('2026-07-12T23:02:00'),
      body: 'You completed the Design Systems wireframes in 2h 10m — 35% faster than predicted. You skipped the morning workout; historically, workout days show 23% higher focus scores.',
      tags: ['Faster than predicted', 'Workout skipped', 'Model updated']
    }
  ]);

  await UserStats.create({});

  console.log('[Seed] Database seeded successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Failed:', err);
  process.exit(1);
});
