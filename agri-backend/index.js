require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { connectDB } = require('./db/connection');
const predictRoutes = require('./routes/predict');
const locationRoutes = require("./routes/location");
const cropRoutes = require("./routes/cropRoutes");
const cors = require('cors');
const soilRoutes = require("./routes/soil");
const authRoutes = require("./routes/auth");


const app = express();
app.use(cors({
  origin: "http://localhost:4200",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));
app.use(bodyParser.json());

// ... rest of your code

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.use('/predict', predictRoutes);
  app.use("/location", locationRoutes);
  app.use("/crops", cropRoutes);
  app.use("/details", soilRoutes);
  app.use("/auth", authRoutes);




  app.get('/', (req, res) => {
    res.send('Crop Price Prediction API (Node.js)');
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB connect error', err);
});
