import express from "express"

import { login, register } from "../controllers/authentication"


export default (router: express.Router) =>{
   router
   .post("/auth/register", register)
   .post("/auth/login", login)
}