const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const header = req.get('authorization');
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required.' });
  try { const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET); req.user = { id: Number(payload.id), role: payload.role }; return next(); }
  catch (_) { return res.status(401).json({ message: 'Your session is invalid or has expired.' }); }
};
const allowRoles = (...roles) => (req, res, next) => !req.user || !roles.includes(req.user.role)
  ? res.status(403).json({ message: 'You do not have permission for this action.' }) : next();
module.exports = { protect, allowRoles };
