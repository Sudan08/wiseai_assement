module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      // 1. The main Expo preset with the nativewind source option
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],

      // 2. The NativeWind Babel preset/macro (moved from plugins to presets)
      "nativewind/babel",
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
      // 3. Reanimated plugin (MUST be the last one)
      "react-native-reanimated/plugin",
    ],
  };
};
