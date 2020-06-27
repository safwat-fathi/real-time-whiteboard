const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Room = require("../models/room.model");
const auth = require("../middleware/auth");

// get all rooms
router.get("/", async (req, res, next) => {
  let rooms = await Room.find({});

  if (rooms.length < 1) {
    return res.status(400).json({
      message: "no rooms",
    });
  }

  res.status(200).json({
    message: `success`,
    rooms,
  });

  next();
});

// create room
router.post("/create", auth, async (req, res, next) => {
  // - add validation for adminID does exist in users DB.
  // - add password for room.
  const { name, adminID, desc } = req.body;

  const room = new Room({
    _id: new mongoose.Types.ObjectId(),
    name,
    adminID,
    desc,
  });

  try {
    await room.save();
    res.status(200).json({
      message: "room created successfully",
      room,
    });
  } catch (err) {
    res.status(500).json({
      message: "room not created",
      error: err,
    });
  }

  next();
});

// edit room
router.post("/edit", async (req, res, next) => {
  const { oldName, newName, desc } = req.body;

  let room = await Room.findOneAndUpdate(
    { name: oldName },
    { name: newName, desc: desc },
    { new: true, useFindAndModify: false }
  );

  if (!room) {
    return res.status(404).json({
      message: "no room found to edit",
    });
  }

  res.status(200).json({
    message: "room edited successfully",
    room,
  });

  next();
});

// change admin
router.post("/changeAdmin", async (req, res, next) => {
  const { oldAdminID, newAdminID } = req.body;

  let room = await Room.findOneAndUpdate(
    { adminID: oldAdminID },
    { adminID: newAdminID },
    { new: true, useFindAndModify: false }
  );

  if (!room) {
    return res.status(404).json({
      message: "no room found to edit",
    });
  }

  res.status(200).json({
    message: "room edited successfully",
    room,
  });

  next();
});

module.exports = router;