const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ensureAuthenticated } = require('../middleware');
const fs = require('fs');
const multer = require('multer');
const validator = require('validator');
const User = require('../models/users');
const Song = require('../models/Song');
const Playlist = require('../models/playlist');
const filePathT = './public/text/intro.txt';
const fileContents = fs.readFileSync(filePathT, 'utf-8');
// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Register GET route
router.get('/register', async (req, res) => {
  res.render('register', { message: req.flash('error'), currentUser: req.user });
});

// Register POST route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters long');
      res.redirect('/register');
    }
    // Validate email
    if (!validator.isEmail(email)) {
      req.flash('error', 'Invalid email format');
      return res.redirect('/register');
    }
    const newUser = new User({ username, email, password });
    await User.register(newUser, password);

    passport.authenticate('local')(req, res, () => {
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
    res.render('register', { message: req.flash('error') });
  }
});

// Login GET route
router.get('/login', async (req, res) => {
  res.render('login', { message: req.flash('error'), currentUser: req.user });
});

// Login POST route
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

// Logout route
router.get('/logout', async (req, res) => {
  req.logOut(() => {
    res.redirect('/');
  });

});



// Define file filter for uploaded files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });





// Index route
router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const playlists = await Playlist.find({ user: req.user._id });

      res.render('index', { currentUser: req.user, playlists, fileContents});
    } else {
      const playlists = await Playlist.find();

      res.render('index', { playlists, currentUser: null ,fileContents});
    }
  } catch (err) {
    console.log(err);
    req.flash('error', 'Error occurred while loading the songs');
    res.redirect('/');
  }
});

// Create Playlist route
router.get('/createPlaylist',ensureAuthenticated, (req,res)=>{
  res.render('createPlaylist',{currentUser:req.user})
})
//Create a new playlist
router.post('/playlists',ensureAuthenticated, async (req,res) => {

  try {
    const { name, userId } = req.body
     console.log(name, userId);

    const playlist = new Playlist({
      name: name,
      user: userId
    });
    await playlist.save();

    const user = await User.findById(userId)
    user.playlists.push(playlist)
    await user.save()

    res.redirect('/');
  } catch (error) {
    console.log('Error creating new playlist', error.message);
    res.status(500).json({ message: 'Internal server error' })
    res.redirect('/')
  }

});

//Display songs of a playlist
router.get('/playlists/:playlistId', ensureAuthenticated ,async (req,res)=>{
  try{
       const {playlistId} = req.params;
       const playlist = await Playlist.findById(playlistId).populate('songs');
       res.render('playlist', {currentUser:req.user, playlist})
  }catch(error){
    console.log(error);
    req.flash('error', 'Error occurred while loading the playlist');
    res.redirect('/');
  }
});

router.get('/playlists/:playlistId/add-song', ensureAuthenticated, async (req, res) => {
  try{
    const {playlistId} = req.params;
    const playlist = await Playlist.findById(playlistId);
     res.render('addSong', {currentUser:req.user , playlist})
  }catch(error){
      console.log(error);
      req.flash('error', 'error occured while loading the song adding page');
      res.redirect('/');
  }
});
//Add a song to a playlist
router.post('/playlists/:playlistId/songs',upload.single('song'), async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { artist,title } = req.body;

    const playlist = await Playlist.findById(playlistId)
    const song = new Song({
      name: title,
      artist:artist,
      filePath: req.file.path,
      fileName: req.file.filename,
      user: req.user._id
    });
    await song.save();

    playlist.songs.push(song._id)
    await playlist.save();
    res.redirect(`/playlists/${playlistId}`)
  } catch (error) {
    console.error('Failed to add song to playlist',error)
    res.status(500).json({ error: 'Failed to add song to playlist' });
  }
});
//Delete a song from a playlist
router.post('/playlists/:playlistId/songs/:songId', async (req, res) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findById(playlistId)
    playlist.songs.pull(songId)
    await Playlist.save()

    res.status(200).json({ message: 'Song deleted successfully from playlist' })

  } catch (error) {
    res.status(500).json({ error: 'Failed to delete song from playlist' });
  }
});
// Delete a playlist
router.delete('/playlists/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findByIdAndDelete(playlistId);

    const user = await User.findById(playlist.user);
    user.playlists.pull(playlist);
    await User.save();

    res.status(200).json({ message: "Playlist deleted successdfully" })
  } catch (error) {
    res.status(500).json({ message: 'Error occured while deleting the playlist' });
  }
});

module.exports = router;
