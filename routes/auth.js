const express = require("express");

const router = express.Router();

const { fireAuth, updateUser, isLogin, updateLastLogin, updateRole, getUsers } = require("../controllers/authController.js");
const { isLoggedIn, isTrainer, isAdmin } = require("../middleware/authentication.js");

router.post("/login", fireAuth);
router.put("/auth/update", isLoggedIn, updateUser);
router.get("/auth/islogin", isLoggedIn, isLogin);
router.put("/auth/lastlogin", isLoggedIn, updateLastLogin);
router.put("/auth/role", isLoggedIn, isAdmin, updateRole);
router.get("/auth/users", isLoggedIn, isAdmin, getUsers); 
// get users with pagination by role and name(name should be query parameter)
// so the url will look like this: /auth/users?role=admin&name=chaudhuree&page=1




module.exports = router;
