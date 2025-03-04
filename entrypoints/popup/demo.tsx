import { useEffect, useState } from "react";

export default function Popup() {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getHighContrast" }, (response) => {
      if (response) setIsHighContrast(response.value);
    });
  }, []);

  const toggleHighContrast = () => {
    chrome.runtime.sendMessage(
      { action: "setHighContrast", value: !isHighContrast },
      () => setIsHighContrast(!isHighContrast),
    );
  };

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>High Contrast Mode</h2>
      <button
        onClick={toggleHighContrast}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: isHighContrast ? "#000" : "#ccc",
          color: isHighContrast ? "#fff" : "#000",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        {isHighContrast ? "Disable High Contrast" : "Enable High Contrast"}
      </button>
    </div>
  );
}
