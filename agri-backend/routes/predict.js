const express = require('express');
const router = express.Router();
const tf = require('@tensorflow/tfjs');
const Price = require('../models/Price');

// Utility: parse date and return JS Date; support formats
function parseDate(s){
  if(!s) return null;
  // try dd-mm-yyyy
  const dmy = /^(\d{2})-(\d{2})-(\d{4})$/;
  if(dmy.test(s)){
    const parts = s.split('-');
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }
  // try yyyy-mm-dd
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/;
  if(ymd.test(s)){
    const parts = s.split('-');
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  const t = new Date(s);
  return isNaN(t.getTime()) ? null : t;
}

function monthFromDateString(s){
  const d = parseDate(s);
  if(!d) return null;
  return d.getMonth() + 1;
}

// Train simple model for a series (months -> price)
async function trainModel(monthsArr, priceArr, epochs = 80){
  // normalize months to range 0-1 and prices to mean-std
  const xs = tf.tensor2d(monthsArr.map(m => [m/12]));
  const ys = tf.tensor2d(priceArr.map(p => [p]));

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 32, activation: 'relu', inputShape: [1] }));
  model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

  await model.fit(xs, ys, { epochs });
  return model;
}

// API: POST /predict/monthwise
router.post('/monthwise', async (req, res) => {
  try{
    const { State, District, Commodity } = req.body;
    if(!State || !District || !Commodity) return res.status(400).json({ error: 'State, District, Commodity required' });

    const records = await Price.find({ State, District, Commodity }).sort({ Arrival_Date: 1 }).lean();
    if(!records || records.length < 6) return res.status(400).json({ error: 'Not enough historical records (need ~6+)' });

    const months = [];
    const minPrices = [];
    const maxPrices = [];
    for(const r of records){
      const m = monthFromDateString(r.Arrival_Date);
      if(m === null) continue;
      months.push(m);
      minPrices.push(r.Min_Price || 0);
      maxPrices.push(r.Max_Price || 0);
    }

    if(months.length < 6) return res.status(400).json({ error: 'Not enough parsable date records' });

    const minModel = await trainModel(months, minPrices, 100);
    const maxModel = await trainModel(months, maxPrices, 100);

    const result = [];
    for(let mm = 1; mm <= 12; mm++){
      const mnorm = tf.tensor2d([[mm/12]]);
      const minPred = minModel.predict(mnorm).dataSync()[0];
      const maxPred = maxModel.predict(mnorm).dataSync()[0];
      result.push({
        month: (new Date(2000, mm-1, 1)).toLocaleString('en-us', { month: 'short' }),
        predicted_min: Math.round(minPred),
        predicted_max: Math.round(maxPred)
      });
    }

    return res.json(result);
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// API: POST /predict/day
router.post('/day', async (req, res) => {
  try{
    const { State, District, Commodity, Date } = req.body;
    if(!State || !District || !Commodity || !Date) return res.status(400).json({ error: 'State, District, Commodity, Date required' });

    const targetMonth = monthFromDateString(Date);
    if(!targetMonth) return res.status(400).json({ error: 'Invalid Date format. Use YYYY-MM-DD or DD-MM-YYYY' });

    const records = await Price.find({ State, District, Commodity }).sort({ Arrival_Date: 1 }).lean();
    if(!records || records.length < 6) return res.status(400).json({ error: 'Not enough historical records (need ~6+)' });

    const months = [];
    const minPrices = [];
    const maxPrices = [];
    for(const r of records){
      const m = monthFromDateString(r.Arrival_Date);
      if(m === null) continue;
      months.push(m);
      minPrices.push(r.Min_Price || 0);
      maxPrices.push(r.Max_Price || 0);
    }

    const minModel = await trainModel(months, minPrices, 120);
    const maxModel = await trainModel(months, maxPrices, 120);

    const mnorm = tf.tensor2d([[targetMonth/12]]);
    const minPred = minModel.predict(mnorm).dataSync()[0];
    const maxPred = maxModel.predict(mnorm).dataSync()[0];

    return res.json({
      Date,
      Predicted_Min_Price: Math.round(minPred),
      Predicted_Max_Price: Math.round(maxPred)
    });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
