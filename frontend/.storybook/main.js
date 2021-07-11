module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.tsx"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode",
    "@storybook/addon-backgrounds",
    "storybook-addon-designs"
  ],
  "core": {
    "builder": "webpack5"
  }
}