/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require("path");
const blacklist = require("metro-config/src/defaults/blacklist");

// react-native >= 0.57

const extraNodeModules = {
  "rn-zalo": path.resolve(__dirname + "/../../")
};
const watchFolders = [
  path.resolve(__dirname + "/../../"),
  path.resolve(__dirname + "/node_modules")
];

module.exports = {
  projectRoot: path.resolve(__dirname, "."),
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false
      }
    })
  },
  resolver: {
    blacklistRE: blacklist([
      /node_modules\/.*\/node_modules\/react-native\/.*/
    ]),

    // https://github.com/facebook/metro/issues/1#issuecomment-453450709
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) => path.join(process.cwd(), `node_modules/${name}`)
      }
    )
  },
  watchFolders
};
