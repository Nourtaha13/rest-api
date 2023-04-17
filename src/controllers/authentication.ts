import express from "express";
import { createUser, getUserByEmail } from "../db/users"
import { random, authentication } from "../helpers"


export const login = async (req: express.Request, res: express.Response) => {
   try {
      const { email, password } = req.body
      if(!email || !password) {
         throw new Error("Please provide email and password");
      }
      const user = await getUserByEmail(email).select("+authentication.salt +authentication.password")
      if(!user) {
         throw new Error("User not found")
      }
      const expectedHash = authentication(user.authentication.salt, password)
      if(user.authentication.password !== expectedHash) {
         throw new Error("Wrong password")
      }
      const salt = random()
      user.authentication.sessionToken = authentication(salt, user._id.toString())
      await user.save()
      res.cookie("auth-session", user.authentication.sessionToken)
      
      return res.status(200).json({
         ok: true,
         data: user
      }).end();
   } catch (error) {
      return res.status(400).json({
            ok: false,
            error: error.message
         }).end();
   }
}

export const register = async (req: express.Request, res: express.Response) => {
   try {
      const { email, username, password } = req.body;    
      if(!email || !username || !password){
         throw new Error("Please enter a valid all input.")
      }
      const existingUser = await getUserByEmail(email);
      if(existingUser){
         throw new Error("User already exists")
      }
      const salt = random();
      const user = await createUser({
         email,
         username,
         authentication: {
            salt,
            password: authentication(salt, password)
         }
      })
      return res.status(200).json({
         ok: true,
         data: user
      }).end();
   } catch (error) {
      return res.status(400).json({
            ok: false,
            error: error.message
         }).end();
   }
}