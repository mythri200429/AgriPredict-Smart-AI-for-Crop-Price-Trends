const mongoose = require('mongoose');

const cropDetailSchema = new mongoose.Schema({
    crop_name: String,
    image_url: String,
    overview: String,
    soil_requirements: Object,
    climate_and_weather: Object,
    water_requirements: Object,
    fertilizer_schedule: Object,
    pests_and_control: Array,
    diseases_and_control: Array,
    harvesting: Object
});

module.exports = mongoose.model('CropDetail', cropDetailSchema,'CropDetail');
