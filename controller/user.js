const { User } = require("../models");

exports.readUsers = async (req, res) => {
  try {
    const usersData = await User.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({ data: usersData });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
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
      message: "Success Deleted",
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
