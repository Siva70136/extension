import { defineBackground } from "wxt/sandbox";

export default defineBackground(async () => {
  // console.log("chrome.accessibilityFeatures:", chrome.accessibilityFeatures);
  // console.log(typeof (chrome.accessibilityFeatures))
  // for (let i in chrome.accessibilityFeatures) {
  //   console.log(i);

  // }
  const extensionId = browser.runtime.id;
  console.log(extensionId);
  const allCookies = await chrome.cookies.getAll({});
  console.log(allCookies);
  await storage.setMeta("local:preference", { theme: "dark", language: "en" });

  const info = await storage.getMeta("local:preference");
  //onst data= await info.json();
  console.log("mete" + JSON.stringify(info));
  const userId = storage.defineItem("local:userId");

  await storage.setItems([
    { key: "local:installDate", value: Date.now() },
    { item: userId, value: 7013 },
  ]);

  await storage.setItems([
    { key: "session:installDate", value: Date.now() },
    { item: userId, value: 7015 },
  ]);
  browser.runtime.onInstalled.addListener(({ reason }: any) => {
    if (reason === "install") {
      browser.tabs.create({
        url: "./index.html",
      });
    }
  });

  //======= close previouse tab ==========
  browser.tabs.onCreated.addListener(async function () {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await browser.tabs.query(queryOptions);
    if (tab?.id !== undefined) {
      browser.tabs.remove(tab.id - 1);
    }
  });

  //======= creating bookmarks ==========
  function createBookmark(title: string, url: string) {
    chrome.bookmarks.create({
      title: title,
      url: url,
    });
  }

  createBookmark(
    "Extensions Wiki",
    "https://wiki.mozilla.org/Add-ons/WebExtensions"
  );
  //createBookmark('Extensions doc', 'https://developer.chrome.com/docs/extensions');

  // ======== Move Tabls ========
  // browser.tabs.onActivated.addListener(moveToFirstPositionMV2);
  // function moveToFirstPositionMV2(activeInfo: any) {
  //   browser.tabs.move(activeInfo.tabId, { index: 0 }, () => {
  //     if (browser.runtime.lastError) {
  //       const error: any = browser.runtime.lastError;
  //       if (error == "Error: Tabs cannot be edited right now (user may be dragging a tab).") {
  //         setTimeout(() => moveToFirstPositionMV2(activeInfo), 50);
  //       } else {
  //         console.error(error);
  //       }
  //     } else {
  //       console.log("Success.");
  //     }
  //   });
  // }

  // ======== copy text of the tab ========

  browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "getSelectedText") {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log(tab?.id);

      if (tab?.id) {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => window.getSelection()?.toString() || "",
        });

        // Extract selected text from results
        const selectedText = results[0]?.result || "";
        console.log("selected text: ", selectedText);
        sendResponse({ text: selectedText });
      } else {
        sendResponse({ text: "" });
      }
    }
    return true; // Required for async sendResponse
  });

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getSelectedText") {
      browser.tabs.query(
        { active: true, currentWindow: true },
        async (tabs) => {
          const tab = tabs[0];
          console.log("Active Tab ID:", tab?.id);

          if (tab?.id) {
            try {
              let results: any;
              if (chrome.scripting) {
                results = await chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: () => window.getSelection()?.toString() || "",
                });
              } else if (browser.tabs.executeScript) {
                results = await browser.tabs.executeScript(tab.id, {
                  code: "window.getSelection()?.toString() || ''",
                });
              }

              console.log(results);
              const selectedText = results[0]?.result || results[0] || "";
              console.log("Selected Text:", selectedText);

              sendResponse({ text: selectedText });
            } catch (error) {
              console.error("Error executing script:", error);
              sendResponse({ text: "" });
            }
          } else {
            sendResponse({ text: "" });
          }
        }
      );

      return true;
    }
  });

  function getAcceptLanguages() {
    browser.i18n.getAcceptLanguages(function (languageList) {
      var languages = languageList.join(",");
      console.log(JSON.stringify(languages));
    });
  }
  getAcceptLanguages();

  function updateTabCountBadge() {
    browser.tabs.query({ currentWindow: true }, (tabs) => {
      browser.action.setBadgeText({ text: tabs.length.toString() });
      browser.action.setBadgeBackgroundColor({ color: "#008000" });
    });
  }

  // Update whenever a tab is created or removed
  browser.tabs.onCreated.addListener(updateTabCountBadge);
  browser.tabs.onRemoved.addListener(updateTabCountBadge);

  // Initial update
  updateTabCountBadge();

  // ==== accessibility features =================
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getHighContrast") {
      browser.accessibilityFeatures.animationPolicy.get({}, (details) => {
        sendResponse({ value: details.value });
      });
      return true;
    }

    if (message.action === "setHighContrast") {
      browser.accessibilityFeatures.animationPolicy.set({ value: "none" }, () =>
        console.log("Animations disabled!")
      );

      return true;
    }
  });

  // ======== Get the cookies ========

  browser.tabs.onUpdated.addListener(
    function listener(tabId, changeInfo, updatedTab) {
      console.log("Tab Updated -change:", changeInfo);
      console.log("Tab Updated", updatedTab);
      if (updatedTab.url) {
        const url = new URL(updatedTab.url || "");
        console.log(`${url.protocol}//${url.host}`);
        browser.cookies.get(
          { url: `${url.protocol}//${url.host}` || "", name: "jwt_token" },
          (cookie) => {
            console.log(cookie?.value);
            if (cookie) {
              alert("Session ID: " + cookie.value);
            } else {
              alert("Cookie not found.");
            }
          }
        );

        browser.tabs.onUpdated.removeListener(listener);
      }
    }
  );

  // === Get the History  ===
  browser.tabs.onCreated.addListener(async (tab) => {
    const dataUrl = await browser.tabs.captureVisibleTab();
    console.log(dataUrl);
    browser.history.onVisited.addListener(function (details) {
      console.log("History Visit:", details);
      console.log(`Visiting ${details.url}`);
    });
  });
});

// get extId  -c
// tab close  -c
// copying text
// browser api mv3
// actions
// tailwind -c
// environment -c
// extensions api
// prettier -c
// storage -c
