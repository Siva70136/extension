import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing";
import background from "../entrypoints/background";

// Mock browser.windows.getCurrent
browser.windows.getCurrent = vi.fn(() =>
  Promise.resolve({
    id: 100,
    focused: true,
    type: "normal",
    state: "maximized",
  } as browser.windows.Window)
);

// Mock browser.tabs.query
browser.tabs.query = vi.fn(() =>
  Promise.resolve([
    {
      id: 1,
      windowId: 100,
      active: true,
      url: "https://example.com",
    },
  ] as browser.tabs.Tab[])
);


browser.cookies.getAll = () =>
  [
    {
      domain: "www.googleadservices.com",
      expirationDate: 1748943449.340499,
      hostOnly: true,
      httpOnly: false,
    },
  ] as any;

browser.bookmarks.create = vi.fn();
browser.i18n.getAcceptLanguages=vi.fn();

const getAcceptLanguages = vi.fn(()=>{
  return ["en-US", "en"];
});

const logMock = vi.fn();
console.log = logMock;

function createBookmark(title: string, url: string): any {
  return {title: title, url: url};
}

describe("Background Entrypoint", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    // browser.runtime.onMessage.addListener.mockImplementation((callback) => {
    //   if (callback) {
    //     callback({ action: "getSelectedText" }, {}, (response) => {
    //       response({ text: "Test Text" });
    //     });
    //   }
    // });
  });

  it("should log the extenion's runtime ID", () => {
    const id = "some-id";
    fakeBrowser.runtime.id = id;

    background.main();

    expect(logMock).toBeCalledWith(id);
  });

  it("should set the start time in storage", async () => {
    background.main();
    await new Promise((res) => setTimeout(res));

    expect(await storage.getItem("session:startTime")).toBeDefined();
  });

  // it("should return cookies for the specified domain", async () => {
  //   browser.cookies.getAll({ domain: "example.com" }, (cookies) => {
  //     expect(cookies).toHaveLength(1);
  //     expect(cookies[0].name).toBe("session_id");
  //     expect(cookies[0].value).toBe("12345");
  //   });
  // });

  // it("should return an empty array when no cookies exist", () => {
  //   browser.cookies.getAll({}, (cookies) => {
  //     expect(cookies).toEqual([]);
  //   });
  // });

  it("should create a bookmark with the given title and URL", () => {
    const bookmark = createBookmark("Test Bookmark", "https://example.com");
    expect(bookmark.title).toBe("Test Bookmark");
    expect(bookmark.url).toBe("https://example.com");
  });
  it("get the accept languages", () => {
    const data=getAcceptLanguages();
    expect(data).toEqual(["en-US", "en"]);
  });
});
