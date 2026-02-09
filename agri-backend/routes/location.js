const express = require("express");
const router = express.Router();
const State = require("../models/State");

// GET all states
router.get("/states", async (req, res) => {
  try {
    const states = await State.find({}, { state: 1, _id: 0 });
    const stateNames = states.map(s => s.state);
    res.json(stateNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/statesprediction", async (req, res) => {
  try {
    const states = await State.find(
      { isPredictionAvailable: true },
      { state: 1, _id: 0 }
    );
    const stateNames = states.map(s => s.state);
    res.json(stateNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET districts by state
router.get("/districts/:state", async (req, res) => {
  try {
    const { state } = req.params;
    const stateDoc = await State.findOne({ state });
    if (!stateDoc) return res.status(404).json({ error: "State not found" });
    res.json(stateDoc.districts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
