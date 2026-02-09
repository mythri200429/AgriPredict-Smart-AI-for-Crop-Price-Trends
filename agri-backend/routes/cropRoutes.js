const express = require("express");
const router = express.Router();
const Commodity = require("../models/commodity");
const CropDetail = require('../models/CropDetail');

// GET all states
router.get("/commodity", async (req, res) => {
  try {
    const commodity = await Commodity.find({}, { name: 1, _id: 0 });
    const commodityNames = commodity.map(s => s.name);
    res.json(commodityNames);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get('/', async (req, res) => {
    const crops = await CropDetail.find();
    res.json(crops);
});

// Get crop by name
router.get('/:name', async (req, res) => {
    const crop = await CropDetail.findOne({ crop_name: req.params.name });
    res.json(crop);
});

module.exports = router;
