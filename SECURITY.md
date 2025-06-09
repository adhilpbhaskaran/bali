# Security Guidelines

This document outlines the security measures implemented in the Bali Tourism CMS and provides guidelines for maintaining security.

## Implemented Security Measures

### 1. Authentication & Authorization

#### JWT Security
- JWT tokens are signed with a secure secret (minimum 32 characters)
- Tokens include `iat` (issued at) timestamp for validation
- HTTP-only cookies prevent XSS attacks on tokens
- Secure cookie settings with `sameSite: 'strict'`

#### Rate Limiting
- Login attempts are rate-limited per IP address
- Default: 5 attempts per 15 minutes
- Rate limits reset on successful authentication
- Configurable via environment variables

#### Password Security
- Passwords are hashed using bcrypt
- Environment variables used for production credentials
- Development fallback credentials clearly marked

### 2. Content Security

#### XSS Prevention
- Replaced `dangerouslySetInnerHTML` with `SafeContentRenderer`
- HTML content is sanitized before rendering
- Whitelist approach for allowed HTML tags and attributes
- Safe parsing of HTML content into React elements

#### Window Security
- All `window.open` calls include `noopener,noreferrer`
- Explicit `opener = null` assignment prevents tabnabbing
- External links are properly secured

### 3. Development Security

#### Logging
- Conditional logging utility prevents debug logs in production
- Environment-based log level control
- API and debug logging separated

#### Event Listeners
- Proper cleanup of event listeners in useEffect hooks
- Memory leak prevention
- Consistent cleanup patterns across components

## Environment Configuration

### Required Environment Variables

```bash
# Authentication
JWT_SECRET="your-very-secure-jwt-secret-here-minimum-32-characters"
ADMIN_EMAIL="admin@bali-malayali.com"
ADMIN_PASSWORD_HASH="your-bcrypt-hashed-admin-password"
USER_EMAIL="user@example.com"
USER_PASSWORD_HASH="your-bcrypt-hashed-user-password"

# Rate Limiting
RATE_LIMIT_MAX="5"
RATE_LIMIT_WINDOW="900000"

# Security
ENCRYPTION_KEY="your-32-character-encryption-key"
```

### Password Hashing

To generate bcrypt hashes for production:

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 12);
console.log(hash);
```

## Security Best Practices

### 1. Environment Management
- Never commit `.env` files to version control
- Use `.env.example` as a template
- Rotate secrets regularly
- Use different secrets for different environments

### 2. Content Handling
- Always sanitize user-generated content
- Use the `SafeContentRenderer` for HTML content
- Validate and escape data before database storage
- Implement Content Security Policy (CSP) headers

### 3. API Security
- Validate all input parameters
- Use proper HTTP status codes
- Implement request validation middleware
- Log security events for monitoring

### 4. Frontend Security
- Avoid `dangerouslySetInnerHTML` when possible
- Use secure `window.open` patterns
- Implement proper error boundaries
- Clean up event listeners and subscriptions

## Security Checklist

### Before Deployment
- [ ] All environment variables configured
- [ ] JWT secret is secure (32+ characters)
- [ ] Passwords are properly hashed
- [ ] Rate limiting is enabled
- [ ] Debug logging is disabled in production
- [ ] Content sanitization is working
- [ ] External links are secured
- [ ] HTTPS is enforced
- [ ] Security headers are configured

### Regular Maintenance
- [ ] Update dependencies regularly
- [ ] Monitor security logs
- [ ] Rotate secrets periodically
- [ ] Review and update rate limits
- [ ] Test authentication flows
- [ ] Audit user permissions

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not** create a public GitHub issue
2. Email security concerns to: [security@bali-malayali.com]
3. Include detailed steps to reproduce
4. Allow time for investigation before public disclosure

## Security Updates

This document should be updated whenever:
- New security measures are implemented
- Security configurations change
- Vulnerabilities are discovered and fixed
- Best practices evolve

---

**Last Updated:** December 2024
**Version:** 1.0