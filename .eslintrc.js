module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        'prefer-template': ['error'],
        "no-unused-vars":0,
        "arrow-spacing":1,
        "space-in-parens": ["error", "always"],
        "space-before-function-paren": ["error","always"],
        "space-infix-ops": ["error", {"int32Hint": false}]
    }
};