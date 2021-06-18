const bcrypt = require("bcrypt"),
  userSchema = require("../models/user.model"),
  crypto = require("crypto"),
  jwt = require("jsonwebtoken");

class LoginController {
  constructor() {}
}

LoginController.prototype.login = async (req, res, next) => {
  const reqUser = req.body;
  if (!reqUser.username || !reqUser.password)
    return res.status(405).json({
      messgae: !reqUser.username
        ? "Username Cant be empty"
        : "Password cant be empty.",
    });

  const userInfo = await userSchema.findOne({
    username: reqUser.username,
  });
  if (!userInfo)
    return res.status(405).json({
      message: "Invalid username",
    });

  try {
    if (await bcrypt.compare(reqUser.password, userInfo.password)) {
      // Remove password before sending user info.
      var userObj = userInfo.toObject();
      delete userObj.password;

      // Create token with user info.
      const secretKey = crypto.randomBytes(64).toString("hex");
      const token = jwt.sign(userObj, secretKey);

      res.status(200).json({
        token: token,
        object: userObj,
        message: "Successfully Logged In.",
      });
    } else {
      res.status(405).json({
        message: "Invalid password",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = new LoginController();