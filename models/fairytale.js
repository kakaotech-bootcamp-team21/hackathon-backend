const mongoose = require('mongoose');

const fairytaleSchema = new mongoose.Schema({
    // _id 필드를 명시하지 않으면 MongoDB가 자동으로 ObjectID를 생성함
    // 
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String, 
        required: true,
    },
});

module.exports = mongoose.model('Fairytale', fairytaleSchema);
