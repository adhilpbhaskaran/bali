import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Mock user database - In production, this would be a real database
// Users should be loaded from environment variables or database
const getUsers = () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@bali-malayali.com';
  const adminPassword = process.env.ADMIN_PASSWORD_HASH;
  const userEmail = process.env.USER_EMAIL || 'user@example.com';
  const userPassword = process.env.USER_PASSWORD_HASH;
  
  const users = [];
  
  if (adminPassword) {
    users.push({
      id: '2',
      email: adminEmail,
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
  }
  
  if (userPassword) {
    users.push({
      id: '1',
      email: userEmail,
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'user'
    });
  }
  
  // Fallback for development only
  if (process.env.NODE_ENV === 'development' && users.length === 0) {
    console.warn('⚠️  Using default development credentials. Set ADMIN_PASSWORD_HASH and USER_PASSWORD_HASH in production!');
    users.push(
      {
        id: '1',
        email: 'user@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'John',
        lastName: 'Doe',
        role: 'user'
      },
      {
        id: '2',
        email: 'admin@bali-malayali.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      }
    );
  }
  
  return users;
};

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Rate limiting function
const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const userAttempts = rateLimitStore.get(ip);
  
  if (!userAttempts) {
    rateLimitStore.set(ip, { attempts: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if lockout period has passed
  if (now - userAttempts.lastAttempt > LOCKOUT_DURATION) {
    rateLimitStore.set(ip, { attempts: 1, lastAttempt: now });
    return true;
  }
  
  // Check if user is locked out
  if (userAttempts.attempts >= MAX_ATTEMPTS) {
    return false;
  }
  
  // Increment attempts
  rateLimitStore.set(ip, { 
    attempts: userAttempts.attempts + 1, 
    lastAttempt: now 
  });
  
  return true;
};

// Reset rate limit on successful login
const resetRateLimit = (ip: string): void => {
  rateLimitStore.delete(ip);
};

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Get users dynamically
    const users = getUsers();
    
    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Reset rate limit on successful login
    resetRateLimit(ip);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1000)
      },
      JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie with enhanced security
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // Enhanced security
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}