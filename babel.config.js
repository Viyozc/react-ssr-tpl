module.exports = {
  "presets": [
    "@babel/preset-typescript",
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-syntax-dynamic-import",
    ["@babel/plugin-transform-runtime", {
      corejs: 3
    }]
  ]
}