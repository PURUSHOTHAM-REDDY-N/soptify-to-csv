const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const csvWriter = createCsvWriter({
    path: './file.csv',
    header: [
        {id: 'track_id', title: 'track_id'},
        {id: 'track_name', title: 'track_name'},
        {id: 'album_name', title: 'album_name'},
        {id: 'release_date', title: 'release_date'}
    ]
});

// Replace 'your_access_token' with your actual Spotify access token.
const accessToken = 'BQBqp6UzHmdlf_0luaVBSqn03ZurBldATuWRLlKN-43poX70FjfvUgcutUCc5ERLzsNidKApWiawy-xSs3LrMtuzzxyzTp6YVBowhkKEqrA8PGXTv9kl7rZGKhWNdw4XpUhPGwkoUp6qXXdxZY72_s0Ja9bnffUYf8Oat7jekMGC8SpnjxsUHyE5j4HVAP5po3v7jSfapmb9znjiQSJM8z6Nw2UNd_fSKLz5qMW9kp5oLafMT0zsnJwwRpTPCqKY20etkQwTO4ywmvI';

axios.get('https://api.spotify.com/v1/me/playlists', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
  }
})
.then(response => {
  // Response with the list of playlists
  const playlists = response.data.items;
  
  // Process and print out playlist IDs
  const playlistIds = playlists.map(playlist => playlist.id);
  console.log("Playlist IDs: ", playlistIds);
})
.catch(error => {
  console.log(error);
});
