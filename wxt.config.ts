import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: [
      "activeTab",
      "bookmarks",
      "clipboardRead",
      "clipboardWrite",
      "accessibilityFeatures.read",
      "accessibilityFeatures.modify",
      "cookies",
      "history",
      "desktopCapture",
      "storage",
      "tabs",
    ],
    host_permissions: ["<all_urls>"],
  },
});
