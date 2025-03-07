import { useState } from "react";

const Popup = () => {
  const [streamId, setStreamId] = useState<string | null>(null);

  const startScreenCapture = () => {
    console.log("Start screen capture");
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window", "tab"],
      (id) => {
        if (!id) {
          console.log("User canceled screen sharing.");
          return;
        }
        setStreamId(id);
        console.log("Stream ID:", id);
      }
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Screen Capture</h1>
      <button
        onClick={startScreenCapture}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Start Capture
      </button>
      {streamId && <p className="mt-3 text-green-500">Stream ID: {streamId}</p>}
    </div>
  );
};

export default Popup;
