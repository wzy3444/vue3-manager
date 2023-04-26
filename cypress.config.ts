import { defineConfig } from "cypress";
import getCompareSnapshotsPlugin from "cypress-visual-regression/dist/plugin";

export default defineConfig({
  component: {
    devServer: {
      framework: "vue-cli",
      bundler: "webpack",
    },
  },
  env: {
    screenshotsFolder: './cypress/snapshots/actual',
    trashAssetsBeforeRuns: true,
    video: false,
    failSilently: false,
    SNAPSHOT_BASE_DIRECTORY:'@/cypress/visual-regression/snapshot',
    SNAPSHOT_DIFF_DIRECTORY:'@/cypress/visual-regression/diff'
  },
  e2e: {
    baseUrl: "http://localhost:4000",
    chromeWebSecurity: false,
    specPattern: "cypress/e2e/**/*.spec.*",
    supportFile: false,
    setupNodeEvents(on, config) {
      getCompareSnapshotsPlugin(on, config);
    }
  }
});
