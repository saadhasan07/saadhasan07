import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

// Extend the session interface to include admin authentication
declare module 'express-session' {
  interface SessionData {
    adminAuthenticated?: boolean;
  }
}

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check if this is a login attempt
  if (req.path === '/api/admin/login' && req.method === 'POST') {
    return next();
  }

  // Check if admin is authenticated
  if (req.session.adminAuthenticated) {
    return next();
  }

  // Return 401 for API routes
  if (req.path.startsWith('/api/admin')) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }

  // For non-API admin routes, redirect to login
  if (req.path.startsWith('/admin')) {
    return res.redirect('/admin/login');
  }

  next();
};

export const adminLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Simple authentication - in production, use proper hashing
  if (username === 'admin' && password === 'admin') {
    req.session.adminAuthenticated = true;
    res.json({ success: true, message: 'Authentication successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const adminLogout = (req: Request, res: Response) => {
  req.session.adminAuthenticated = false;
  res.json({ success: true, message: 'Logged out successfully' });
};

export const checkAdminAuth = (req: Request, res: Response) => {
  res.json({ authenticated: !!req.session.adminAuthenticated });
};