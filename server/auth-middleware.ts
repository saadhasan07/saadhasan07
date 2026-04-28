import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    adminAuthenticated?: boolean;
  }
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.adminAuthenticated) {
    return next();
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({ message: 'Admin authentication required' });
  }

  return next();
};

export const adminLogin = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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
