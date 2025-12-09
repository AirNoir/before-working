module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@components': './src/components',
            '@screens': './src/screens',
            '@store': './src/store',
            '@utils': './src/utils',
            '@types': './src/types',
            '@constants': './src/constants',
            '@locales': './src/locales',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      // react-native-reanimated/plugin 必須在最後
      'react-native-reanimated/plugin',
    ],
  };
};

