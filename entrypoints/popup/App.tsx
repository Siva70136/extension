import { useState, useEffect } from "react";
import CookieManager from "./cookie";
import Notes from "./Note";
import Popup from "./secreen";

const App = () => {
  return (
    <div className="text-center p-5 border border-gray-300 rounded-lg shadow-md">
      <Notes />
      <Popup />
    </div>
  );
};

export default App;
