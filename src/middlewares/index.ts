import express from "express"

import { get, merge } from "lodash"

import { getUserBySessionToken } from "../db/users"

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
   try {
      const { id } = req.params
      const currentUserId = get(req, 'identity._id') as string
      
      if(!currentUserId){
         throw new Error('Not logged in')
      }
      if(currentUserId.toString() !== id){
         throw new Error('Not authorized')
      }
      next()
   } catch (error) {
      return res.status(400).json({
         ok: false,
         error: error.message
      })
   }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
   try {
      const sessionToken = req.cookies["auth-session"]
      if(!sessionToken){
         throw new Error("Unauthorized")
      }
      const existingUser = await getUserBySessionToken(sessionToken)
      
      if(!existingUser){
         throw new Error("Authentication failed")
      }
      merge(req, { identity: existingUser });
      return next()
   } catch (error) {
      return res.status(400).json({
         ok: false,
         error: error.message
      })
   }
}
