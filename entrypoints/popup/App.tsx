import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CookieManager from "./cookie";
import Notes from "./Note";
import Login from "./Login";
import Google from "./GoogleSignin";

const App = () => {
  return (
    <div className="text-center p-5 ">
      <Router>
        <Google />
        <Routes>
          <Route path="/popup.html" element={<Login />} />
          <Route path="/home" element={<Notes />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
