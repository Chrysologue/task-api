import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { JwtPayload, Role } from "../types/user.js";
export function checkAuthentication(req: Request, res: Response, next: NextFunction){
    const authorization = req.headers.authorization
    if(!authorization){
        return res.status(401).json({error: "Missing authorization"})
    }
    if(!authorization.startsWith("Bearer")){
        return res.status(401).json({error: "Invalid or expired token"})
    }
    const token = authorization.split(" ")[1]
    const secret = process.env.JWT_TOKEN
    if(!secret){
        throw new Error('JWT_TOKEN is not defined')
    }

    try{
        const decoded  = jwt.verify(token, secret) as JwtPayload
        req.user = decoded
        next()
    }
    catch(err){
        console.error(err)
        return res.status(500).json({error: "Internal server error"})
    }
}

export function checkRole(role: Role){
    return function(req: Request, res: Response, next: NextFunction){
        if(req.user?.role !== role){
            return res.status(403).json({error: "Access denied"})
        }
        next()
    }
}