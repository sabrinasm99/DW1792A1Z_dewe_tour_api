const { User } = require("../models");
const fse = require("fs-extra");

exports.readUsers = async (req, res) => {
  try {
    const usersData = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({ message: "Response Success", data: usersData });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.readDetailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const findUser = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({ message: "Response Success", data: findUser });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.editUserPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const  findUser = await User.findOne({ where: { id } });
    const oldImage = findUser.image;
    await fse.remove(`./images/${oldImage}`);
    const { image } = req.files;
    const imageName = image.name;
    await image.mv(`images/${imageName}`);
    await User.update({ image: imageName }, { where: { id } });
    const findUserUpdate = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({ message: "Success Update Image", data: findUserUpdate });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({
      message: `User with id ${id} has been deleted`,
      data: {
        id,
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
