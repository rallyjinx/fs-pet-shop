#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];

if (cmd === 'read') {
  fs.readFile(petsPath, 'utf8', function(err, data) {
    if (err) {
      throw err;
    }
    const index = Number.parseInt(process.argv[3]);
    const pets = JSON.parse(data);

    if (Number.isNaN(index)) {
      console.log(pets);
      process.exit();
     }

    if (index < 0 || index >= pets.length) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }

    console.log(pets[index]);
 });
}
else if (cmd === 'create') {
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    const pets = JSON.parse(data);
    const age = Number.parseInt(process.argv[3]);
    const kind = process.argv[4];
    const name = process.argv[5];

    if (isNaN(age) || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} AGE KIND NAME`);
      process.exit(1);
    }
    const pet = { age, kind, name };
    pets.push(pet);
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pet);
    });
  });
}
else if (cmd === 'update') {
  // Usage: node pets.js update INDEX AGE KIND NAME
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    const pets = JSON.parse(data);
    const index = Number.parseInt(process.argv[3]);
    const age = Number.parseInt(process.argv[4]);
    const kind = process.argv[5];
    const name = process.argv[6];

    if (isNaN(index) || isNaN(age) || !kind || !name) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }
    if (index >= pets.length || index < 0) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX AGE KIND NAME`);
      process.exit(1);
    }
    pets[index] = { age, kind, name };
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(pets[index]);
    });
  });
}
else if (cmd === 'destroy') {
// Usage: node pets.js destroy INDEX
  fs.readFile(petsPath, 'utf8', function(readErr, data) {
    if (readErr) {
      throw readErr;
    }
    const pets = JSON.parse(data);
    const ind = Number.parseInt(process.argv[3]);

    if (isNaN(ind) || ind >= pets.length || ind < 0) {
      console.error(`Usage: ${node} ${file} ${cmd} INDEX`);
      process.exit(1);
    }
    const destroyed = pets[ind]
    pets.splice(ind, 1);
    const petsJSON = JSON.stringify(pets);

    fs.writeFile(petsPath, petsJSON, function(writeErr) {
      if (writeErr) {
        throw writeErr;
      }
      console.log(destroyed);
    });
  });
}
else {
  console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
  process.exit(1);
}
