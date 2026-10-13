const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const invalidPassword = p => p.length < 10 || !/[a-z]/i.test(p) || !/\d/.test(p);
const safeUser = ({ id, name, email, role }) => ({ id, name, email, role });
const token = user => jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });
exports.login = async (req, res, next) => {
  const email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  try { const [rows] = await db.execute('SELECT id, name, email, password, role FROM users WHERE email = ?', [email]); const user = rows[0]; if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password.' }); return res.json({ success: true, token: token(user), user: safeUser(user) }); } catch (e) { return next(e); }
};
async function create(req, res, next, roles) {
  const name = String(req.body.name || '').trim(), email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || ''), confirmPassword = String(req.body.confirmPassword || ''), role = req.body.role || 'parent';
  if (!name || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'A name and valid email are required.' });
  if (!roles.has(role)) return res.status(403).json({ message: 'This role cannot be created here.' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' });
  if (invalidPassword(password)) return res.status(400).json({ message: 'Password must be at least 10 characters and include a letter and number.' });
  try { const [result] = await db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, await bcrypt.hash(password, 12), role]); return res.status(201).json({ success: true, user: { id: result.insertId, name, email, role } }); } catch (e) { if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'An account with that email already exists.' }); return next(e); }
}
exports.registerPublic = (req, res, next) => create(req, res, next, new Set(['parent']));
exports.registerManaged = (req, res, next) => create(req, res, next, new Set(['driver', 'parent']));
exports.updatePassword = async (req, res, next) => { const { oldPassword, newPassword, confirmPassword } = req.body; if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match.' }); if (invalidPassword(String(newPassword || ''))) return res.status(400).json({ message: 'Password must be at least 10 characters and include a letter and number.' }); try { const [rows] = await db.execute('SELECT password FROM users WHERE id = ?', [req.user.id]); if (!rows[0] || !(await bcrypt.compare(String(oldPassword || ''), rows[0].password))) return res.status(400).json({ message: 'Current password is incorrect.' }); await db.execute('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 12), req.user.id]); return res.json({ success: true, message: 'Password updated.' }); } catch (e) { return next(e); } };
exports.getAllUsers = async (_req, res, next) => { try { const [rows] = await db.execute('SELECT id, name, email, role FROM users ORDER BY id DESC'); res.json(rows); } catch (e) { next(e); } };
exports.deleteUser = async (req, res, next) => { if (Number(req.params.id) === req.user.id) return res.status(400).json({ message: 'You cannot delete your own account.' }); try { await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]); res.json({ success: true }); } catch (e) { next(e); } };
