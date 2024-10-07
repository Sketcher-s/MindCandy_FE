import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['dist'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'no-unused-vars': 'off',

  //     // 포맷팅 관련 규칙
  // 'indent': ['error', 2],  // 2칸 들여쓰기
  // 'quotes': ['error', 'double'],  // 작은 따옴표 사용
  // 'semi': ['error', 'always'],  // 세미콜론 항상 사용
  // 'comma-dangle': ['error', 'always-multiline'],  // 마지막 요소의 쉼표 허용
  // 'object-curly-spacing': ['error', 'always'],  // 중괄호 내부에 공백 허용
  // 'array-bracket-spacing': ['error', 'never'],  // 배열 대괄호 내부에 공백 허용하지 않음
    },
  },
]
