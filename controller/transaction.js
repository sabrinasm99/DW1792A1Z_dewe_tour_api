const { Transaction } = require("../models");
const { Trip } = require("../models");

exports.addTransaction = async (req, res) => {
  try {
    const { attachment } = req.files;
    const attachmentName = attachment.name;
    await attachment.mv(`./images/${attachmentName}`);
    const { counterQty, total, status, tripId } = req.body;
    const dataTransaction = {
      counterQty,
      total,
      status,
      attachment: attachmentName,
      tripId,
    };
    const postTransaction = await Transaction.create(dataTransaction);
    res
      .status(200)
      .send({ message: "Success Add Transaction", data: postTransaction });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await Transaction.update({ status: req.body.status }, { where: { id } });
    const dataTransaction = await Transaction.findOne({
      where: { id },
      include: {
        model: Trip,
        as: "trip",
        attributes: {
          exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
        },
      },
      attributes: { exclude: ["tripId", "TripId", "createdAt", "updatedAt"] },
    });
    res.status(200).send({
      message: `Data with id ${id} has been updated`,
      data: dataTransaction,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.readDetailTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const detailTransaction = await Transaction.findOne({
      where: { id },
      include: {
        model: Trip,
        as: "trip",
        attributes: {
          exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
        },
      },
      attributes: { exclude: ["tripId", "TripId", "createdAt", "updatedAt"] },
    });
    res.status(200).send({ data: detailTransaction });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.readOrders = async (req, res) => {
  try {
    const orders = await Transaction.findAll({
      include: {
        model: Trip,
        as: "trip",
        attributes: {
          exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
        },
      },
      attributes: { exclude: ["tripId", "TripId", "createdAt", "updatedAt"] },
    });
    res.status(200).send({data: orders})
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
