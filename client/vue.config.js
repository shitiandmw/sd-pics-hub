// module.exports = {
//   configureWebpack: {
//     resolve : {
//         fallback:{
//             crypto: require.resolve("crypto-browserify")  ,
//             constants: require.resolve("constants-browserify") ,
//             stream:  require.resolve("stream-browserify") ,
//         }
//     }
//   },
// };

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  // Other rules...
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
};
