module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      // react-native-reanimated/plugin 必須在最後
      'react-native-reanimated/plugin',
    ],
  };
};

