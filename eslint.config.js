import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { 
    ignores: ['dist'] 
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { 
          jsx: true 
        },
        sourceType: 'module'
      }
    },
    settings: { 
      react: { 
        version: '18.3' 
      } 
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      // JSX 관련 규칙 비활성화
      'react/prop-types': 'off',
      'react/forbid-prop-types': 'off',
      'react/require-default-props': 'off',
      'react/default-props-match-prop-types': 'off',
      'react/no-unused-prop-types': 'off',
      'react/no-typos': 'off',
      'react/sort-prop-types': 'off',
      'react/no-unknown-property': ['error', { ignore: ['intensity', 'position', 'args', 'column'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-curly-spacing': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'react/jsx-props-no-multi-spaces': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-equals-spacing': 'off',
      'react/jsx-wrap-multilines': 'off',
      'no-multi-spaces': 'off',
      'object-curly-spacing': 'off',
      'react/jsx-tag-spacing': 'off',
      // React Refresh 규칙
      'react-refresh/only-export-components': [
        'warn',
        { 
          allowConstantExport: true 
        }
      ]
    }
  }
]