import { type Request, type Response } from 'express';
import type { User } from '../types/User.js';
import db from "../db/connection.js"
import jwt  from 'jsonwebtoken';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';

dotenv.config();

class UserController {
    static registerUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if(!email || !password) {
                res.status(404).json({
                    message: "Email and password are required"
                })
            }

            const existingUser = await db.query("SELECT id FROM users WHERE email = $1", [email]);
            
            if (existingUser.rows.length > 0) {
                res.status(409).json({ message: 'User already exists' });
                return;
            }

            const passwordHash = await bcrypt.hash(password, 10);
            
            const newUser = await db.query(
                `
                INSERT INTO users (email, password)
                VALUES ($1, $2)
                RETURNING id, email
                `,
                [email, passwordHash]
            )

            res.status(201).json({
                message: "User registered successsfully",
                user: newUser.rows[0]
            });

        } catch (error) {
            console.error("Register error:", error);

            res.status(500).json({ message: 'Internal server error' });
        }
    };

    static loginUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

             if (!email || !password) {
                res.status(400).json({
                    message: "Email and password are required"
                });
                return;
            }

            const result = await db.query(` SELECT id, email, password
                FROM users
                WHERE email = $1`, [email]);

            const user = result.rows[0];

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

            res.status(200).json({
                token
            });

        } catch (error) {
            console.error("Login error:", error);

            res.status(500).json({ message: 'Internal server error' });
        }
    };
}

export default UserController;
