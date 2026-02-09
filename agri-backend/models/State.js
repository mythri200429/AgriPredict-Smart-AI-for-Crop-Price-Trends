const mongoose = require("mongoose");

const StateSchema = new mongoose.Schema({
  state: { type: String, required: true },
  districts: { type: [String], required: true }
});

module.exports = mongoose.model("State", StateSchema,'lststate');
