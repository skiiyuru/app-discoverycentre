import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  ignores: ['src/components/**', 'src/db/migrations/**'],
  extends: [
    'plugin:@next/next/recommended',
    'plugin:@next/next/core-web-vitals',
    'next/typescript',
  ],
  rules: {
    'ts/no-redeclare': 'off',
    'ts/consistent-type-definitions': ['error', 'type'],
    'no-console': ['warn'],
    'antfu/no-top-level-await': ['off'],
    'node/prefer-global/process': ['off'],
    'node/no-process-env': ['error', {
      allowedVariables: ['NEXT_RUNTIME'],
    }],
    'perfectionist/sort-imports': ['error', {
      tsconfigRootDir: '.',
    }],
    'unicorn/filename-case': ['error', {
      case: 'kebabCase',
      ignore: ['README.md'],
    }],
  },
})
