const { Country } = require("../models");

exports.readCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
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
    const detailCountry = Country.findOne({
      where: {
        id,
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
    const savedData = await Country.create(req.body);
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
