import { type Request, type Response } from 'express';
import type { User } from '../types/User.js';
import jwt  from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();

const mockUsers: User[] = [
    {
    id: '1',
    email: 'user1@example.com',
    password: bcrypt.hashSync('password1', 10),
  },
  {
    id: '2',
    email: 'user2@example.com',
    password: bcrypt.hashSync('password2', 10),
  }, 
];

class UserController {
    static registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const existingUser = mockUsers.find(user => user.email === email);
            
            if (existingUser) {
                res.status(400).json({ message: 'User already exists' });
                return;
            }

            const passwordHash = await bcrypt.hash(password, 10);
            
            const newUser: User = {
                id: `${mockUsers.length + 1}`,
                email,
                password: passwordHash
            };

            mockUsers.push(newUser);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const user = mockUsers.find(user => user.email === email);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export default UserController;
