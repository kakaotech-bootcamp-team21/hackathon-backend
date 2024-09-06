const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
    partId: Number,
    content: String,
    imageUri: String
})

const fairytaleSchema = new mongoose.Schema({
    storyId : {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
    },
    parts: [partSchema]
});

module.exports = mongoose.model('Fairytale', fairytaleSchema);
