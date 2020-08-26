const { Trip, Country } = require("../models");
const fse = require("fs-extra");
const Fuse = require("fuse.js");
const options = {
  keys: ['title']
}

exports.readTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: {
        model: Country,
        as: "country",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
      },
    });
    let result = [...trips];
    const fuse = new Fuse(result, options);
    if (req.query.search) {
      result = fuse.search(req.query.search).map(val => {
        return val.item
      })
    }
    res.status(200).send({
      message: "Response Success",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.readDetailTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const detailTrip = await Trip.findOne({
      where: {
        id,
      },
      include: {
        model: Country,
        as: "country",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
      },
    });
    res.status(200).send({
      message: "Response Success",
      data: detailTrip,
    });
  } catch (err) {
    res.status(500).send({
      error: {
        message: err.message,
      },
    });
  }
};

exports.addTrip = async (req, res) => {
  try {
    const { tripImage } = req.files;
    const tripImageName = tripImage.name;
    await tripImage.mv(`./images/${tripImageName}`);

    const addTrip = await Trip.create({ ...req.body, image: tripImageName });
    res.status(200).send({ message: "Success Add Trip", data: addTrip });
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.editTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const detailTrip = await Trip.findOne({ where: { id } });
    if (detailTrip) {
      const editTrip = {
        ...req.body,
      };
      const oldImage = detailTrip.image;
      if (req.files) {
        await fse.remove(`./images/${oldImage}`);
        const newTripImage = req.files.tripImage;
        const newTripImageName = newTripImage.name;
        await newTripImage.mv(`./images/${newTripImageName}`);
        editTrip.image = newTripImageName;
      }
      await Trip.update(editTrip, { where: { id } });
      const newDetailTrip = await Trip.findOne({
        where: {
          id,
        },
        include: {
          model: Country,
          as: "country",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
        attributes: {
          exclude: ["countryId", "CountryId", "createdAt", "updatedAt"],
        },
      });
      res.status(200).send({
        message: `Data with id ${id} has been updated`,
        data: newDetailTrip,
      });
    } else {
      res.status(400).send({ message: "Data isn't exist" });
    }
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const detailTrip = await Trip.findOne({ where: { id } });
    if (detailTrip) {
      const oldImage = detailTrip.image;
      await fse.remove(`./images/${oldImage}`);
      await Trip.destroy({ where: { id } });
      res
        .status(200)
        .send({ message: `Data with id ${id} has been deleted`, data: { id } });
    } else {
      res.status(400).send({ message: "Data isn't exist" });
    }
  } catch (err) {
    res.status(500).send({
      error: {
        message: "Server Error",
      },
    });
  }
};
