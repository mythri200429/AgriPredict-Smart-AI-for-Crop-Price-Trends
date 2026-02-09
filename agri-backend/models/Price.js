const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  State: String,
  District: String,
  Market: String,
  Commodity: String,
  Arrival_Date: String,
  Min_Price: Number,
  Max_Price: Number,
  Modal_Price: Number
});

module.exports = mongoose.model('Price', PriceSchema,'crop_prices');

