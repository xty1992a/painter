const utils = require("./utils");
const ts = require("../tsconfig.json");

const drop = (str) => str.replace(/\/\*$/, "");

const { paths } = ts.compilerOptions;
// const ts = utils.readJSON(utils.root('tsconfig.json'))
const alias = Object.entries(paths).reduce((pre, [key, [way]]) => {
  return {
    ...pre,
    [drop(key)]: utils.root(drop(way)),
  };
}, {});

module.exports = {
  resolve: {
    alias,
  },
};
