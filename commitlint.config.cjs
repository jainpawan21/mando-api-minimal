'use strict'
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'always', 'sentence-case'],
    'header-max-length': [0, 'always', 500],
    'body-max-line-length': [0, 'always', 500],
  },
}
