// backend - middleware/authMiddleware.js
//Property/Booking API protect করতে এই middleware ব্যবহার করবেন।
import { auth } from '../lib/auth.js';
// eslint-disable-next-line import/extensions
import { fromNodeHeaders } from 'better-auth/node';

const authMiddleware = async (req, res, next) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = session.user;
  next();
};

export default authMiddleware;
