{
  "name": "research-assistant-root",
  "version": "1.0.0",
  "description": "a chat application",
  "contributors": [
    "sai <SaiJoshan.Dasireddy@aepx.com>",
    "sai <dasiredysaijoshan@gmail.com>"
  ],
  "license": "UNLICENSED",
  "scripts": {
    "start": "one-app-runner",
    "prebuild": "npm run clean",
    "build": "bundle-module --dev",
    "watch:build": "bundle-module --dev --watch",
    "live:build": "bundle-module --dev --live",
    "clean": "rimraf build",
    "prepare": "husky install && npm run build && npm run test:unit && npm run test:lint -- --fix",
    "pretest:a11y": "create-runner-env && one-app-runner-test-a11y",
    "pretest:browser": "npm run build && create-runner-env && one-app-runner-test",
    "test": "npm run test:lint && npm run test:unit",
    "test:lint": "eslint --ignore-path .gitignore --ext js,jsx,snap .",
    "lint": "eslint --ignore-path .gitignore --ext js,jsx,snap .",
    "test:unit": "jest --testPathIgnorePatterns /__tests__/__utils__/",
    "test:watch": "npm run test:unit -- --watch",
    "predev": "npm run build",
    "dev": "concurrently --names \"one-app-runner,watch:build\" -c \"green,yellow\" \"npm start\" \"npm run watch:build\""
  },
  "one-amex": {
    "app": {
      "compatibility": "5.x || 6.x"
    },
    "product-contacts": [
      "test <test@gmail.com>",
      "test2 <test2@gmail.com>"
    ],
    "runner": {
      "modules": [
        "."
      ],
      "rootModuleName": "research-assistant-root",
      "dockerImage": "artifactory.aexp.com/dockerproxy/oneamex/one-app-dev:6.18.3",
      "envVars": {
        "ONE_CONFIG_ENV": "e1"
      }
    },
    "risk": {
      "level": "low"
    },
    "bundler": {
      "performanceBudget": 5000000
    }
  },
  "dependencies": {
    "@americanexpress/content-security-policy": "^3.76.0",
    "@americanexpress/dls-react": "^1.35.0",
    "@americanexpress/one-app-ducks": "^4.6.5",
    "@americanexpress/one-app-module-wrapper": "^3.6.0",
    "@americanexpress/one-app-router": "^1.2.6",
    "@americanexpress/vitruvius": "^3.0.1",
    "holocron": "^1.12.3",
    "iguazu": "^3.1.0",
    "immutable": "^4.3.7",
    "prop-types": "^15.8.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-helmet": "^6.1.0",
    "react-hot-toast": "^2.5.1",
    "react-icons": "^5.5.0",
    "react-intl": "^6.8.9",
    "react-markdown": "^7.0.1",
    "react-redux": "^7.1.1",
    "redux": "^4.0.4",
    "redux-immutable": "^4.0.0",
    "sass": "^1.83.4",
    "use-authblue-sso": "^2.1.0"
  },
  "devDependencies": {
    "@americanexpress/jest-preset-browser": "^7.2.4",
    "@americanexpress/one-amex-test-utils": "^9.7.1",
    "@americanexpress/one-app-bundler": "^7.4.5",
    "@americanexpress/one-app-runner": "^6.22.4",
    "@axe-core/webdriverio": "^4.10.1",
    "@commitlint/cli": "^19.6.1",
    "@commitlint/config-conventional": "^19.6.0",
    "@testing-library/react": "^12.1.5",
    "amex-jest-preset-react": "^8.1.0",
    "axe-html-reporter": "^2.2.11",
    "babel-eslint": "^10.1.0",
    "babel-preset-amex": "^4.0.3",
    "concurrently": "^8.2.2",
    "core-js": "^3.39.0",
    "cross-env": "^7.0.3",
    "eslint": "^8.57.1",
    "eslint-config-amex": "^16.4.0",
    "eslint-plugin-jest": "^27.9.0",
    "eslint-plugin-jest-dom": "^4.0.3",
    "husky": "^9.1.7",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-image-snapshot": "^6.4.0",
    "prettier": "^2.8.8",
    "rimraf": "^3.0.2"
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "engines": {
    "node": ">=20.x.x",
    "npm": ">=10.x.x"
  },
  "jest": {
    "preset": "amex-jest-preset-react",
    "moduleNameMapper": {
      "^uuid$": "uuid",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
      "^react-markdown$": "<rootDir>/node_modules/react-markdown/react-markdown.js"
    },
    "setupFiles": [
      "./test-setup.js"
    ],
    "snapshotSerializers": []
  },
  "overrides": {
    "ws": "8.18.0",
    "cheerio": "1.0.0-rc.12",
    "@grpc/grpc-js": "^1.10.9",
    "braces": "^3.0.3",
    "cross-spawn": "^7.0.5",
    "elliptic": "^6.5.7",
    "find-my-way": "^9.0.1",
    "micromatch": "^4.0.8",
    "ssri": "^8.0.1",
    "tar": "^7.0.0",
    "webpack": "^5.94.0"
  }
}
