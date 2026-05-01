import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    adminAuthenticated?: boolean;
  }
}

type AdminCredentialConfig = {
  username: string;
  password: string;
  configured: boolean;
  usingDefaultCredentials: boolean;
  source: 'environment' | 'default';
};

function getAdminCredentialConfig(): AdminCredentialConfig {
  const envUsername = process.env.ADMIN_USERNAME?.trim();
  const envPassword = process.env.ADMIN_PASSWORD?.trim();

  if (envUsername && envPassword) {
    return {
      username: envUsername,
      password: envPassword,
      configured: true,
      usingDefaultCredentials: false,
      source: 'environment',
    };
  }

  return {
    username: 'admin',
    password: 'admin',
    configured: false,
    usingDefaultCredentials: true,
    source: 'default',
  };
}

export function getAdminAuthStatus() {
  const config = getAdminCredentialConfig();

  return {
    credentialsConfigured: config.configured,
    usingDefaultCredentials: config.usingDefaultCredentials,
    credentialSource: config.source,
  };
}

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
  const config = getAdminCredentialConfig();

  if (username === config.username && password === config.password) {
    req.session.adminAuthenticated = true;
    res.json({
      success: true,
      message: 'Authentication successful',
      ...getAdminAuthStatus(),
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const adminLogout = (req: Request, res: Response) => {
  req.session.adminAuthenticated = false;
  res.json({ success: true, message: 'Logged out successfully' });
};

export const checkAdminAuth = (req: Request, res: Response) => {
  res.json({ authenticated: !!req.session.adminAuthenticated, ...getAdminAuthStatus() });
};
