import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Get users from environment variables or use development defaults
function getUsers() {
  const users = [];
  
  // Load admin user from environment
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  
  if (adminEmail && adminPasswordHash) {
    users.push({
      id: '2',
      email: adminEmail,
      password: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567891',
      role: 'admin',
      createdAt: new Date().toISOString()
    });
  }
  
  // Load regular user from environment
  const userEmail = process.env.USER_EMAIL;
  const userPasswordHash = process.env.USER_PASSWORD_HASH;
  
  if (userEmail && userPasswordHash) {
    users.push({
      id: '1',
      email: userEmail,
      password: userPasswordHash,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567890',
      role: 'user',
      createdAt: new Date().toISOString()
    });
  }
  
  // Development fallback - WARNING: Only for development!
  if (users.length === 0 && process.env.NODE_ENV === 'development') {
    console.warn('⚠️  Using development-only default credentials. Set environment variables for production!');
    users.push(
      {
        id: '1',
        email: 'user@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        role: 'user',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        email: 'admin@bali-malayali.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567891',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    );
  }
  
  return users;
}

// Mock user database - In production, this would be a real database
let users = getUsers();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password, confirmPassword } = await request.json();

    // Validate input
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    // Add to users array (in production, save to database)
    users.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Registration successful'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}