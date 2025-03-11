const FIREBASE_HOSTING_URL = "https://resoult-f51ff.web.app";

const iframe = document.createElement("iframe");
iframe.src = FIREBASE_HOSTING_URL;
document.body.appendChild(iframe);
console.log("Offscreen document initialized.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("get auth listner");
  if (message.action === "getAuth" && message.target === "offscreen") {
    function handleIframeMessage({ data }) {
      console.log(data);
      try {
        const parsedData = JSON.parse(data);
        window.removeEventListener("message", handleIframeMessage);
        sendResponse(parsedData.user);
      } catch (e) {
        console.error("Error parsing iframe message:", e);
      }
    }

    window.addEventListener("message", handleIframeMessage);
    iframe.contentWindow.postMessage({ initAuth: true }, FIREBASE_HOSTING_URL);
    return true; 
  }
});
