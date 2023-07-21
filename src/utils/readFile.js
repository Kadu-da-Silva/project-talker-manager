const fs = require('fs');
const path = require('path');
const talkersPath = path.resolve(__dirname, '..', './talker.json');

const readFile = () => {
  try {
    const jsonData = fs.readFileSync(talkersPath);
    return JSON.parse(jsonData);
  } catch (error) {
    return [];
  }
};

module.exports = readFile;