
let JWKS;

const getJWKS = async () => {
  if (!JWKS) {
    const { createRemoteJWKSet } = await import('jose');
    JWKS = createRemoteJWKSet(
      new URL(`${process.env.BETTER_AUTH_URL}/api/auth/jwks`)
    );
  }
  return JWKS;
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const { jwtVerify } = await import('jose');
    const jwks = await getJWKS();

    const { payload } = await jwtVerify(token, jwks);

    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verify failed:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

module.exports = { protect };
