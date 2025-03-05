import { beforeEach, describe, expect, it, vi } from "vitest";
import { fakeBrowser } from "wxt/testing";
import background from "../entrypoints/background";

//chrome.i18n.getMessage = () => 'fake-message';

const logMock = vi.fn();
console.log = logMock;

describe("Background Entrypoint", () => {
  beforeEach(() => {
    fakeBrowser.reset();
    // globalThis.browser = {
    //   bookmarks: {
    //     create: vi.fn().mockResolvedValue({
    //       id: "mockId",
    //       title: "Mock Bookmark",
    //       url: "https://mock.com",
    //     }),
    //   },
    // } as any;
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
  // it("should create a bookmark successfully", async () => {
  //   const title = "Test Bookmark";
  //   const url = "https://example.com";

  //   //await createBookmark(title, url);

  //   expect(browser.bookmarks.create).toHaveBeenCalledWith({ title, url });
  // });
});
