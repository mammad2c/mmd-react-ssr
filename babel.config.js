const isProduction = process.env.NODE_ENV === 'production';

const plugins = [
  '@babel/plugin-proposal-class-properties',
  '@babel/transform-runtime',
  '@loadable/babel-plugin',
];

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: isProduction ? plugins : ['react-hot-loader/babel', ...plugins],
};
