const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const joi = require("@hapi/joi");
const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;
    const schema = joi.object({
      fullName: joi.string().min(3).required(),
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
      phone: joi.string().max(15).required(),
      address: joi.string().required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.status(400).send({
        error: {
          message: error.message.details[0],
        },
      });
    }

    const checkEmail = await User.findOne({
      where: {
        email,
      },
    });
    if (checkEmail) {
      return res.status(400).send({
        error: {
          message: "An account with the given email already exists",
        },
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const dataUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    const token = jwt.sign(
      {
        id: dataUser.id,
      },
      process.env.JWT_PASS
    );

    res.status(200).send({
      message: "You have been registered",
      data: {
        email: dataUser.email,
        token,
      },
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const schema = joi.object({
      email: joi.string().email().min(10).required(),
      password: joi.string().min(8).required(),
    });
    const validation = schema.validate(req.body);
    if (validation.error) {
      return res.status(400).send({
        error: {
          message: error.details[0].message,
        },
      });
    }

    const userExist = await User.findOne({
      where: {
        email,
      },
    });
    if (!userExist) {
      return res.status(400).send({
        error: {
          message: "Couldn't find your account",
        },
      });
    }
    const validPass = await bcrypt.compare(password, userExist.password);
    if (!validPass) {
      return res.status(400).send({
        error: {
          message: "Email or password invalid",
        },
      });
    }

    const token = jwt.sign(
      {
        id: userExist.id,
      },
      process.env.JWT_PASS
    );

    res.status(200).send({
      message: "Success Login",
      data: {
        email: userExist.email,
        token,
      },
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
