const fs = require('fs');
const path = require('path');

const talkersPath = path.resolve(__dirname, '..', './talker.json');

const saveDataToFile = (data) => {
  const jsonData = JSON.stringify(data);
  fs.writeFileSync(talkersPath, jsonData);
};

module.exports = saveDataToFile;