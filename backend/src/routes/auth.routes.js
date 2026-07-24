const { Router } = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getmeController,
} = require("../controllers/auth.controller");
const { authUser } = require("../middlewares/auth.middleware");

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.post("/logout", authUser, logout);

authRouter.get("/get-me", authUser, getmeController);

module.exports = authRouter;