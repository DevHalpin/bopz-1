const express = require("express");
const router = require("express").Router();
const { spotifyApi, getAuthUrl } = require("../helpers/spotify");

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log(getAuthUrl());
    res.json(getAuthUrl());
  });

  // Redirect back to homepage after successful login

  router.post("/callback", (req, res) => {
    const error = req.query.error;
    const code = req.body.code;
    const state = req.query.state;

    if (error) {
      console.error("Callback Error:", error);
      res.send(`Callback Error: ${error}`);
      return;
    }

    spotifyApi
      .authorizationCodeGrant(code)
      .then((data) => {
        const access_token = data.body["access_token"];
        const refresh_token = data.body["refresh_token"];
        const expires_in = data.body["expires_in"];

        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);

        console.log("access_token:", access_token);
        console.log("refresh_token:", refresh_token);

        console.log(
          `Sucessfully retreived access token. Expires in ${expires_in} s.`
        );

        // console.log('This is the data:', res.body)

        // Include relevant variables in response so it can be accessed in Login component
        res.send({ access_token, refresh_token, expires_in });

        setInterval(async () => {
          const data = await spotifyApi.refreshAccessToken();
          const access_token = data.body["access_token"];

          console.log("The access token has been refreshed!");
          console.log("access_token:", access_token);
          spotifyApi.setAccessToken(access_token);
        }, (expires_in / 2) * 1000);
      })
      .catch((error) => {
        console.error("Error getting Tokens:", error);
        res.send(`Error getting Tokens: ${error}`);
      });
  });

  return router;
};
