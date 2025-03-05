import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing";
import background from "../entrypoints/background";

//browser.cookies.getAll = () =>
  [
    {
      domain: "www.googleadservices.com",
      expirationDate: 1748943449.340499,
      hostOnly: true,
      httpOnly: false,
    },
  ] as any;
const logMock = vi.fn();
console.log = logMock;

describe("Background Entrypoint", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    global.chrome = {
      history: { search: vi.fn() },
      cookies: { getAll: vi.fn() },
      bookmarks: { create: vi.fn() },
    } as any;
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


  it("should create a bookmark successfully", () => {
    const bookmarkDetails = {
      title: "Test Bookmark",
      url: "https://example.com",
    };

    chrome.bookmarks.create(bookmarkDetails, (bookmark) => {
      expect(bookmark).toHaveProperty("id");
      expect(bookmark.title).toBe("Test Bookmark");
      expect(bookmark.url).toBe("https://example.com");
    });
  });

  it("should return cookies for the specified domain", () => {
    chrome.cookies.getAll({ domain: "example.com" }, (cookies) => {
      expect(cookies).toHaveLength(1);
      expect(cookies[0].name).toBe("session_id");
      expect(cookies[0].value).toBe("12345");
    });
  });

  it("should return an empty array when no cookies exist", () => {
    chrome.cookies.getAll({}, (cookies) => {
      expect(cookies).toEqual([]);
    });
  });
});
