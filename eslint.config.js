const spfxProfile = require('@microsoft/eslint-config-spfx/lib/flat-profiles/react');

module.exports = [
  // Generated build output must never be linted. Only real source files should be.
  // (A config object that has only "ignores" applies to the whole project.)
  {
    ignores: [
      'sharepoint/**',
      'dist/**',
      'lib/**',
      'lib-amd/**',
      'lib-commonjs/**',
      'lib-es6/**',
      'temp/**',
      'release/**',
      'node_modules/**'
    ]
  },
  ...spfxProfile,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.json'
      }
    }
  }
];
