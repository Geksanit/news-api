module.exports = {
    extends: [
      'airbnb-typescript',
      'plugin:prettier/recommended',
      'prettier/@typescript-eslint',
    ],
    plugins: ['prettier'],
    env: {
      node: true,
    },
    parserOptions: {
      project: './tsconfig.json',
    },
    settings: {
      'import/resolver': {
        node: {
          paths: ['./src'],
        },
      },
    },
    globals: {
      window: 'readonly', // todo
    },
    rules: {
      'prettier/prettier': 'error',
      'import/named': 'off',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'error',
      'import/no-cycle': 'off',
      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
        },
      ],
      '@typescript-eslint/camelcase': 'off', // TODO try to remove after eslint-config-airbnb-typescript updating
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/type-annotation-spacing': [
        'error',
        {
          before: false,
          after: true,
          overrides: { arrow: { before: true, after: true } },
        },
      ],
      'no-restricted-imports': ['error', '@material-ui/core', '@material-ui/icons'],
      'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
      'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'no-undef': 'off',
      'consistent-return': 'off',
      'default-case': 'off',
    },
  };