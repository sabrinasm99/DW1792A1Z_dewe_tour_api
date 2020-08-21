const { Transaction, Trip, Country } = require("../models");

exports.addTransaction = async (req, res) => {
  try {
    const { name, counterQty, total, status, tripId } = req.body;
    const dataTransaction = {
      name,
      counterQty,
      total,
      status,
      attachment: null,
      tripId,
    };
    console.log(dataTransaction);
    const postTransaction = await Transaction.create(dataTransaction);
    const findTransaction = await Transaction.findOne({
      where: { id: postTransaction.id },
      include: {
        model: Trip,
        as: "trip",
        attributes: {
          exclude: ["createdAt", "updatedAt", "countryId", "CountryId"],
        },
        include: {
          model: Country,
          as: "country",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "tripId", "TripId"],
      },
    });
    res
      .status(200)
      .send({ message: "Success Add Transaction", data: findTransaction });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.editTransactionByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { attachment } = req.files;
    const attachmentName = attachment.name;
    await attachment.mv(`./images/${attachmentName}`);
    await Transaction.update({ attachment: attachmentName }, { where: { id } });
    res.status(200).send({ message: "Success Edit Transaction" });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.editTransactionByAdmin = async (req, res) => {
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
        include: {
          model: Country,
          as: "country",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      },
      attributes: { exclude: ["tripId", "TripId", "createdAt", "updatedAt"] },
    });
    res
      .status(200)
      .send({ message: "Response Success", data: detailTransaction });
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
    res.status(200).send({ message: "Response Success", data: orders });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
