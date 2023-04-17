import express from "express"

import { deleteUser, getAllUsers, logout, updateUser } from "../controllers/users"
import { isAuthenticated, isOwner } from "../middlewares"



export default (router: express.Router) => {
   router
   .get("/users", isAuthenticated , getAllUsers)
   .delete("/user/:id", [ isAuthenticated, isOwner ] , deleteUser)
   .patch("/user/:id", [ isAuthenticated, isOwner ] , updateUser)
   .get("/logout/:id", [ isAuthenticated, isOwner ] , logout)
}


