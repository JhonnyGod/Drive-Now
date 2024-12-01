import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET as string;

const authToken = (req: Request, res: Response, next: NextFunction) => {
    const Token = req.cookies.Token;
    if(!Token) return res.status(401).json({ok: false, message: 'No token provided'});

    jwt.verify(Token, JWT_SECRET, (err, user)=>{
        if (err) return res.status(403).json({ message: 'Token is not valid' });
        req.user = user;
        next();
    })
}