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
      "identity",
      "offscreen",
    ],
    host_permissions: ["<all_urls>"],
    web_accessible_resources: [
      {
        resources: ["offscreen.html"],
        matches: ["<all_urls>"],
      },
    ],

    oauth2: {
      client_id:
        "908833248797-fpjibraunpcc9i2ioh82mtdefh1mu3f2.apps.googleusercontent.com",
      scopes: ["openid", "email", "profile"],
    },
  },
});

// https://apis.google.com
// https://www.gstatic.com
// https://www.googleapis.com
// https://securetoken.googleapis.com
