# Crop Price Prediction (Node.js)

This is a basic Node.js project that trains a small TensorFlow.js model on historical Min/Max prices from MongoDB and exposes two endpoints:

- `POST /predict/monthwise` - returns 12 months predicted Min & Max prices (monthwise)
- `POST /predict/day` - returns predicted Min & Max price for a specific date

**Notes**
- Uses pure `@tensorflow/tfjs` (no native bindings) to avoid node-pre-gyp install issues.
- For meaningful predictions you need >= ~12 historical records per commodity.

## Setup (local)
1. Install Node 16 or 18.
2. Copy `.env.example` to `.env` and set your `MONGO_URI`.
3. Install deps:
   ```
   npm install
   ```
4. Start server:
   ```
   npm start
   ```
5. Example requests:
   ```
   POST http://localhost:3000/predict/monthwise
   Body: {"State":"Karnataka","District":"Bangalore","Commodity":"Black Gram Dal (Urd Dal)"}
   ```
   ```
   POST http://localhost:3000/predict/day
   Body: {"State":"Karnataka","District":"Bangalore","Commodity":"Black Gram Dal (Urd Dal)","Date":"2026-05-10"}
   ```

## How to push to GitHub
```
git init
git add .
git commit -m "Initial commit"
# create repo on GitHub and then:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

If you want, tell me your GitHub repo name and I can generate the exact `git` commands and a README with badges.
