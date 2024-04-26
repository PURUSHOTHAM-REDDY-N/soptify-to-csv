const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let records=[];
const csvWriter = createCsvWriter({
    path: './file.csv',
    header: [
        {id: 'track_id', title: 'track_id'},
        {id: 'track_name', title: 'track_name'},
        {id: 'album_name', title: 'album_name'},
        {id: 'release_date', title: 'release_date'}
    ]
});

// Replace 'your_access_token' with your actual Spotify OAuth access token.
const accessToken = 'BQBpvwf7zKoh1mrt-LEhAJpd6UXYTThz2REY7bDL2MMR0mOixg6RlP6e38WWKXyR8z8xq6h6mC2q1qBk-McQ89m6xEaX6hzSJREq56wRhx54ny5p6wSJGNoeCugSdSYhgoat8ZHP5qjY7vT0xwX7_OjOFSIbkkzRPddfrBjvLY2oaPfeURj_wZyVTbVXOj13DB13gThD1-27MtgP35VaFVywrkQ9HimYsVAyERFV5kecLbWe0ZLH5et9578bCkrOti9Gvh7CHmI9g2u34_I';

// axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
//   headers: {
//     'Authorization': `Bearer ${accessToken}`,
//   }
// })
// .then(response => {
//   // Process and print out track ID, name, album name, and album release date
//   response.data.tracks.items.forEach( item => {
//     const track = item.track;
//     console.log({
//         track_id: track.id,
//         track_name: track.name,
//         album_name: track.album.name,
//         release_date: track.album.release_date,
//     });
//     records.push({
//         track_id: track.id,
//         track_name: track.name,
//         album_name: track.album.name,
//         release_date: track.album.release_date,
//     });

//   });

//   csvWriter.writeRecords(records)       // returns a promise
//     .then(() => {
//         console.log('...Done');
//     });
// })
// .catch(error => {
//   console.log(error);
// });


async function getPlaylistDetails(playlistId) {
    try {
        const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        return response.data.items
            .filter(item => item.track && item.track.id) // Ensure the track and track ID are present
            .map(item => ({
                track_id: item.track.id,
                track_name: item.track.name || ' ', // Fallback to 'Unknown Name' if missing
                album_name: (item.track.album && item.track.album.name) || ' ', // Fallback to 'Unknown Album' if missing
                release_date: (item.track.album && item.track.album.release_date) || ' ' // Fallback to 'Unknown Release Date' if missing
            }));
    } catch (error) {
        console.error(`Error fetching details for playlist ${playlistId}:`, error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

async function processPlaylists(playlists) {
    let allTracksData = [];

    for (const playlist of playlists) {
        const tracksData = await getPlaylistDetails(playlist.id);
        allTracksData = allTracksData.concat(tracksData);
    }

    return allTracksData;
}

async function getAllPlaylists() {
    let playlists = [];
    let url = `https://api.spotify.com/v1/me/playlists`;
  
    try {
      while (url) {
        // Fetch the playlist data
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Concatenate the current page of playlists with the total array
        playlists = playlists.concat(response.data.items);
  
        // Update the URL to the next page of playlists, if available
        url = response.data.next;
      }
    } catch (error) {
      // Handle errors, such as logging or throwing an exception
      console.error('Failed to fetch playlists:', error.message);
      throw error;
    }
  
    return playlists;
  }

(async () => {
    try {
        const playlists = await getAllPlaylists(); // Assume you have this function defined from previous example
        const allTracksData = await processPlaylists(playlists);
        console.log("all here ",allTracksData);
        await csvWriter.writeRecords(allTracksData);
        console.log('Tracks data has been written to the CSV file successfully.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();