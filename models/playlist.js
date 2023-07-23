const mongoose = require('mongoose')


const playListSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
    }]
});


const Playlist = mongoose.model('Playlist', playListSchema)

module.exports = Playlist;