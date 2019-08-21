const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
        id: 'Number',
        title: 'String'
});

let video = mongoose.model('movie', movieSchema);

module.exports = {
    video
}