const path = require("path");
const fs = require("fs").promises;
const root = (_path) => path.join(__dirname, "..", _path);

const readJSON = async (file) => {
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

module.exports = {
  root,
  readJSON,
};
