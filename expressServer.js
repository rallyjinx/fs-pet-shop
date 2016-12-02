'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');

const express = require('express');
const app = express();
const port = process.env.PORT || 8000;



app.get('/pets', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }

    const pets = JSON.parse(petsJSON);
    res.send(pets);
  });
});

app.get('/pets/:id', (req, res) => {
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
    if (err) {
      console.error(err.stack);
      return res.sendStatus(500);
    }
    const id = Number.parseInt(req.params.id);
    const pets = JSON.parse(petsJSON);
    if (Number.isNaN(id) || id < 0 || id >= pets.length) {
      console.log("id", id);
      return res.sendStatus(404);
    }
    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send(pets[id]);

  });
});

app.use( (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
