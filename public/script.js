function getCurrentDateTime() {
  const currentDate = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', min: 'numeric', sec: 'numeric' }
  return currentDate.toLocaleDateString('en-US', options)

}





document.addEventListener('DOMContentLoaded', () => {
  const songNames = document.querySelectorAll('.song-name');

  songNames.forEach((songName) => {
    const audioPlayer = songName.querySelector('.audio-player');
    const songTitle = songName.querySelector('.song-title');
    const songId = audioPlayer.id.replace('audio-player-', '');

    console.log('Song ID:', songId);
    console.log('File Path:', audioPlayer.src);

    // Remove existing event listeners
    songTitle.removeEventListener('click', togglePlay);
    audioPlayer.removeEventListener('pause', updatePlayIcon);
    audioPlayer.removeEventListener('play', updatePlayIcon);

    // Add new event listeners
    songTitle.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('pause', updatePlayIcon);
    audioPlayer.addEventListener('play', updatePlayIcon);
  });
});

function togglePlay(event) {
  const songTitle = event.currentTarget;
  const audioPlayer = songTitle.querySelector('.audio-player');

  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function updatePlayIcon(event) {
  const audioPlayer = event.currentTarget;
  // Update the play icon display here based on the audioPlayer.paused value
}
