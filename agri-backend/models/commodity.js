const mongoose = require("mongoose");

const CommoditySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("Commodity", CommoditySchema,'commodity');
