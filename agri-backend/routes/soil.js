const express = require("express");
const router = express.Router();
const Soil = require("../models/soil");

// 1. Fetch all soil names
router.get("/soils", async (req, res) => {
    try {
        const soils = await Soil.find({}, { soilname: 1 });
        res.json(soils);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 2. Fetch commodities based on soil
router.get("/soil/:soilname", async (req, res) => {
    try {
        const soilname = req.params.soilname;

        const soil = await Soil.findOne({ soilname });

        if (!soil) {
            return res.status(404).json({ message: "Soil not found" });
        }

        res.json({
            soilname: soil.soilname,
            commodities: soil.commodity
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
