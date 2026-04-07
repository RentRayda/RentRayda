import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { auth } from './lib/auth';
import { authRouter } from './routes/auth';
import { storageRouter } from './routes/storage';
import { landlordsRouter } from './routes/landlords';
import { tenantsRouter } from './routes/tenants';
import { listingsRouter } from './routes/listings';
import { adminRouter } from './routes/admin';
import { connectionsRouter } from './routes/connections';
import { reportsRouter } from './routes/reports';
import { usersRouter } from './routes/users';
import { globalRateLimiter } from './middleware/rate-limit';

const app = new Hono();

// Health check (before global rate limiter)
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' });
});

// Global rate limiter: 100 requests/min per IP — safety net for all routes
app.use('*', globalRateLimiter());

// Auth routes (send-otp, verify-otp, logout, me) — BEFORE better-auth catch-all
app.route('/api/auth', authRouter);

// better-auth handler — catches remaining /api/auth/* routes (session, callbacks, etc.)
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

// Storage routes (presigned-url, confirm)
app.route('/api/storage', storageRouter);

// Landlord routes
app.route('/api/landlords', landlordsRouter);

// Tenant routes
app.route('/api/tenants', tenantsRouter);

// Listing routes
app.route('/api/listings', listingsRouter);

// Connection routes
app.route('/api/connections', connectionsRouter);

// User routes
app.route('/api/users', usersRouter);

// Report routes
app.route('/api/reports', reportsRouter);

// Admin routes
app.route('/api/admin', adminRouter);

const port = Number(process.env.PORT) || 3001;

serve({ fetch: app.fetch, port }, () => {
  console.log(`RentRayda API running on port ${port}`);
});

export default app;
