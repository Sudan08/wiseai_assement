// react-native.config.js
module.exports = {
  dependencies: {
    // This tells the autolinker (and Expo build system)
    // to SKIP linking the native code for this package.
    "react-native-worklets": {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
