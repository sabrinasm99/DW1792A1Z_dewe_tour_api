const { Country } = require("../models");

exports.readCountries = async (req, res) => {
  try {
    const countries = await Country.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({ data: countries });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.readDetailCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const detailCountry = await Country.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({ data: detailCountry });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.addCountry = async (req, res) => {
  try {
    const { name } = req.body;
    const checkName = await Country.findOne({ where: { name } });
    if (checkName) {
      res
        .status(400)
        .send({ message: `The country name: ${name} has already exist` });
    }
    const savedData = await Country.create({ name });
    res.status(200).send({
      message: "Country has been added",
      data: savedData,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.editCountry = async (req, res) => {
  try {
    const { id } = req.params;
    await Country.update(
      { name: req.body.name },
      {
        where: {
          id,
        },
      }
    );
    const updatedCountry = await Country.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      message: `ID ${id} Success Updated`,
      data: updatedCountry,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
