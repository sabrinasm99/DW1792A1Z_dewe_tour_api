const { Transaction, Trip, Country, User } = require("../models");
const fse = require("fs-extra");
const { Op } = require("sequelize");

exports.addTransaction = async (req, res) => {
  try {
    const { userId, counterQty, total, status, tripId, bookingDate } = req.body;
    const dataTransaction = {
      userId,
      counterQty,
      total,
      status,
      attachment: "",
      tripId,
      bookingDate,
    };
    const postTransaction = await Transaction.create(dataTransaction);
    const findTransaction = await Transaction.findOne({
      where: { id: postTransaction.id },
      include: [
        {
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
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "tripId", "TripId", "userId"],
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

exports.uploadProofPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransaction = await Transaction.findOne({ where: { id } });
    const oldImage = findTransaction.attachment;
    if (findTransaction.attachment && !req.files) {
      await Transaction.update(
        { attachment: findTransaction.attachment },
        { where: { id } }
      );
      res.status(200).send({ message: "Success Edit Transaction" });
    } else if (req.files) {
      if (oldImage) {
        await fse.remove(`./images/${oldImage}`);
      }
      const { attachment } = req.files;
      const attachmentName = attachment.name;
      await attachment.mv(`./images/${attachmentName}`);
      await Transaction.update(
        { attachment: attachmentName },
        { where: { id } }
      );
      res.status(200).send({ message: "Success Edit Transaction" });
    } else {
      res.status(400).send({ message: "You Must Upload Payment Proof" });
    }
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.agreeToPay = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransaction = await Transaction.findOne({ where: { id } });
    if (findTransaction.attachment) {
      const { status } = req.body;
      await Transaction.update({ status }, { where: { id } });
      res.status(200).send({ message: "Success Edit Transaction" });
    } else {
      res.status(400).send({ message: "You must upload payment proof first" });
    }
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
    const { status } = req.body;
    const findTransaction = await Transaction.findOne({ where: { id } });
    const oldImage = findTransaction.attachment;
    await fse.remove(`./images/${oldImage}`);
    const { attachment } = req.files;
    const attachmentName = attachment.name;
    await attachment.mv(`./images/${attachmentName}`);
    await Transaction.update(
      { status, attachment: attachmentName },
      { where: { id } }
    );
    const dataTransaction = await Transaction.findOne({
      where: { id },
      include: [
        {
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
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: { exclude: ["tripId", "TripId", "createdAt", "updatedAt"] },
    });
    res.status(200).send({
      message: `Data with id ${id} has been updated`,
      data: dataTransaction,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.readDetailTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const detailTransaction = await Transaction.findOne({
      where: { id },
      include: [
        {
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
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: [
          "userId",
          "UserId",
          "tripId",
          "TripId",
          "createdAt",
          "updatedAt",
        ],
      },
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

exports.readApproveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransaction = await Transaction.findAll({
      where: { userId: id, status: "Approve" },
      include: [
        {
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
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: [
          "userId",
          "UserId",
          "tripId",
          "TripId",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    res
      .status(200)
      .send({ message: "Response Success", data: findTransaction });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.readWaitingTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const findTransaction = await Transaction.findAll({
      where: {
        userId: id,
        [Op.or]: [{ status: "Waiting Payment" }, { status: "Waiting Approve" }],
      },
      include: [
        {
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
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: [
          "userId",
          "UserId",
          "tripId",
          "TripId",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    if (findTransaction) {
      res
        .status(200)
        .send({ message: "Response Success", data: findTransaction });
    } else {
      res.status(400).send({ message: "Data Not Found" });
    }
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.readOrders = async (req, res) => {
  try {
    const orders = await Transaction.findAll({
      include: [
        {
          model: Trip,
          as: "trip",
          attributes: {
            exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
          },
        },
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: [
          "userId",
          "UserId",
          "tripId",
          "TripId",
          "createdAt",
          "updatedAt",
        ],
      },
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
