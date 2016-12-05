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
    const id = Number.parseInt(req.params.id, 10);
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

app.post('/pets', (req, res) => {
  let bodyJSON = '';

  req.on('data', (chunk) => {
    bodyJSON += chunk.toString();
  });
  fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
      if (err) {
        console.error(err.stack);
        return res.sendStatus(500);
      }
      const body = JSON.parse(bodyJSON);
      const pets = JSON.parse(petsJSON);
      const age = Number.parseInt(body.age, 10);
      const kind = body.kind;
      const name = body.name;

      if (Number.isNaN(age) || !kind || !name) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Bad Request');
        return;
      }

      const pet = { age, kind, name };

      pets.push(pet);

      const petJSON = JSON.stringify(pet);
      const newPetsJSON = JSON.stringify(pets);

      fs.writeFile(petsPath, newPetsJSON, (writeErr) => {
        if (writeErr) {
          throw writeErr;
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(petJSON);
      });
  });

});
app.use( (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
