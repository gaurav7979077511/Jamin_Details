import { loginUser, registerUser } from '../../application/services/auth.service.js';

export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
