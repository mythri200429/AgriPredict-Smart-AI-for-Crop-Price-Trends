const mongoose = require('mongoose');

const SoilSchema = new mongoose.Schema({
    soilname: { type: String, required: true },
    commodity: { type: [String], required: true }
});

module.exports = mongoose.model("Soil", SoilSchema,'soil');
