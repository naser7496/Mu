function getCurrentDateTime() {
  const currentDate = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', min: 'numeric', sec: 'numeric' }
  return currentDate.toLocaleDateString('en-US', options)

}


document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to all delete buttons with class "delete-song"
  const deleteButtons = document.querySelectorAll(".delete-song");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const songId = button.dataset.songId;
      const playlistId = button.dataset.playlistId;

      try {
        // Make a POST request to delete the song from the playlist
        const response = await fetch(`/playlists/${playlistId}/songs/${songId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          // Song deleted successfully, you can reload the page or update the DOM accordingly
          // For example, remove the deleted song row from the table
          button.closest("tr").remove();
        } else {
          // Handle the error case, e.g., show an error message
          console.error("Failed to delete song from playlist");
        }
      } catch (error) {
        console.error("Error occurred while deleting the song", error);
      }
    });
  });



  //edit button for songs
  const editAnchors = document.querySelectorAll(".edit-song");
  editAnchors.forEach((anchor) => {
    anchor.addEventListener("click", async (event) => {
      event.preventDefault();

      const songId = anchor.dataset.songId;
      const playlistId = anchor.dataset.playlist
      const currentName = anchor.dataset.songName;

      //We ask user to Enter a new name
      const newName = prompt("Enter the new song name:", currentName);

      //if the user provided a new name an d clicked ok in the prompt , proceed to update the song name
      if (newName !== null) {
        try {
          //Make a post request to update the song name
          const response = await fetch(`/songs/${songId}/edit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newName }) //send the new name in the request body
          });

          if (response.ok) {
            const updatedData = response.json();
            const updatedSongName = updatedData.song;
            // Song name updated successfully, you can update the song name in the DOM
            // For example, find the element with the song name and replace its text with the new name
            const songTitleElement = anchor.closest(".song-name").querySelector(".song-title");
            songTitleElement.innerText = updatedSongName;
            console.log(songTitleElement);
          } else {
            // Handle the error case, e.g., show an error message
            console.error("Failed to update song name");
          }
        }
        catch (error) {
          console.error("Error occurred while updating the song name", error);
        }
      }

    })
  });
});


