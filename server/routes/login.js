const express = require('express')
const router = require('express').Router();

const SpotifyWebApi = require('spotify-web-api-node');



module.exports = () => {


  // User data Spotify wants to retrieve
  const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
  ];


  // credentials are optional
const spotifyApi = new SpotifyWebApi({
  clientId: 'a18068c5cef44a94a879d8455bf4c855',
  clientSecret: '4fd794840f1c4c2487a292ba8db7c020',
  redirectUri: 'http://localhost:3000'
});

  router.get('/', (req, res) => {
    console.log('Reached server route')
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
  });

// Redirect back to homepage after successful login
  router.get('http://localhost:3000', (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;
    console.log("Callback was called");

    if (error) {
      console.error('Callback Error:', error);
      res.send(`Callback Error: ${error}`);
      return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);

        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );
        res.send('Success! You can now close the window.');

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body['access_token'];

          console.log('The access token has been refreshed!');
          console.log('access_token:', access_token);
          spotifyApi.setAccessToken(access_token);
        }, expires_in / 2 * 1000);
      })
      .catch(error => {
        console.error('Error getting Tokens:', error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });

  return router;
}
