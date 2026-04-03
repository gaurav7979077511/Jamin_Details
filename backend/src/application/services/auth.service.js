import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../infrastructure/db/models/user.model.js';
import { env } from '../../config/env.js';

export const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const exists = await UserModel.findOne({ email: normalizedEmail });
  if (exists) throw new Error('Email already exists');
  const hash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email: normalizedEmail, password: hash, role: role || 'viewer' });
  return user;
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const user = await UserModel.findOne({ email: normalizedEmail });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ id: user._id.toString(), role: user.role, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
  return { token, user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } };
};
