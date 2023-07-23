const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  songs : [{type: mongoose.Schema.Types.ObjectId,ref:'Song'}],
  playlists:[{type: mongoose.Schema.Types.ObjectId, ref:'Playlist'}]
});


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
