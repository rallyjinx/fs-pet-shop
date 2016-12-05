'use strict';

const http = require('http');
const port = process.env.PORT || 8000;

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const petRegExp = /^\/pets\/(.*)$/;

var server = http.createServer(function(req, res) {
  if (req.method === 'GET' && req.url === '/pets') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
      if (err) {
        console.error(err.stack);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Internal Server Error');
      }
      var pets = JSON.parse(data);
      var petsJSONget = JSON.stringify(pets);
      var index =
      res.setHeader('Content-Type', 'application/json');
      res.end(petsJSONget);
    });
  }
  else if (req.method === 'GET' && petRegExp.test(req.url)) {
    fs.readFile(petsPath, 'utf8', (err, petsJSON) => {
     if (err) {
       throw err;
     }

     const matches = req.url.match(petRegExp);
     const id = Number.parseInt(matches[1]);
     const pets = JSON.parse(petsJSON);

     if (id < 0 || id >= pets.length || Number.isNaN(id)) {
       res.statusCode = 404;
       res.setHeader('Content-Type', 'text/plain');
       res.end('Not Found');

       return;
     }

     const petJSON = JSON.stringify(pets[id]);

     res.setHeader('Content-Type', 'application/json');
     res.end(petJSON);
   });
  }
  else if (req.method === 'POST' && req.url === '/pets') {
     let bodyJSON = '';

     req.on('data', (chunk) => {
       bodyJSON += chunk.toString();
     });

     req.on('end', () => {
       fs.readFile(petsPath, 'utf8', (readErr, petsJSON) => {
         if (readErr) {
           throw readErr;
         }
         const body = JSON.parse(bodyJSON);
         const pets = JSON.parse(petsJSON);
         const age = Number.parseInt(body.age);
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
           res.end(petJSON);
         });
       });
     });
   }

  else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    return res.end('Not found');
  }
});

server.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = server;
