// backend/middlewares/authJwt.js
import { jwtVerify, createRemoteJWKSet } from 'jose';

const AUTH_BASE_URL = process.env.BETTER_AUTH_URL || 'http://localhost:8000';

// Better Auth JWT public keys (JWKS) endpoint
const JWKS = createRemoteJWKSet(new URL(`${AUTH_BASE_URL}/api/auth/jwks`));

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }

    // Verify JWT with Better Auth JWKS
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: AUTH_BASE_URL,
      // audience চাইলে এখানে সেট করতে পারো
    });

    // Better Auth JWT payload এ সাধারণত sub, email, role ইত্যাদি থাকবে
    // তুমি চাইলে payload console.log করে দেখে নিতে পারো
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role || 'TENANT',
    };

    next();
  } catch (error) {
    console.error('JWT verify error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
