module.exports = {
  extends: 'stylelint-config-recommended-scss',
  rules: {
    'rule-empty-line-before': [
      'always',
      {
        ignore: 'first-nested'
      }
    ],
    indentation: 2
  }
};
