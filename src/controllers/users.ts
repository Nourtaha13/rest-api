import express from "express"

import { deleteUserById, getUserById, getUsers } from "../db/users"

export const getAllUsers = async ( req: express.Request, res: express.Response ) => {
   try {
      const users = await getUsers()
      return res.status(200).json({
         ok: true,
         data: users
      }).end();
   } catch (error) {
      return res.status(400).json({
         ok: false,
         error: error.message,
      }).end();
   }
}

export const deleteUser = async ( req: express.Request, res: express.Response ) => {
   try {
      const { id } = req.params
      
      const deletedUser = await deleteUserById(id)
      
      return res.status(200).json({
         ok: true,
         data: deletedUser
      }).end();
   } catch (error) {
      return res.status(400).json({
         ok: false,
         error: error.message,
      }).end();
   }
}

export const updateUser = async ( req: express.Request, res: express.Response ) => {
   try {
      const { username } = req.body
      const { id } = req.params

      if(!username) {
         throw new Error("Username is required")
      }
      
      const user = await getUserById(id)
      
      user.username = username
      await user.save()
      
      return res.json({
         ok: true,
         data: user
      }).end();
   } catch (error) {
      return res.status(400).json({
         ok: false,
         error: error.message,
      })
   }
}

export const logout = async ( req: express.Request, res: express.Response ) => {
   try {
      const { id } = req.params

      const user = await getUserById(id)
      
      user.authentication.sessionToken = ""
      await user.save()
      
      req.cookies["auth-session"] = null

      return res.json({
         ok: true,
         data: "Successfully logged out"
      }).end();
   } catch (error) {
      return res.status(400).json({
         ok: false,
         error: error.message,
      })
   }
}
