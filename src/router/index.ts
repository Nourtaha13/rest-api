import express from "express"
import authentication from "./authentication"
import users from "./users"

const router = express.Router()

export default () => {
   
   authentication(router)
   users(router)
   
   return router
}