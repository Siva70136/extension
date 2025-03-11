import { useNavigate } from "react-router-dom";
const Google = () => {
  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const handleLogin = () => {
    chrome.runtime.sendMessage({ action: "signIn" }, function (response) {
      console.log(response);
      try {
        if (response) {
          setIsLogin(true);
          navigate("/home");
        }
      } catch (err) {
        console.log("error", err);
      }
    });
  };
  const handleLogout = () => {
    chrome.runtime.sendMessage({ action: "signOut" }, function (response) {
      console.log(response);
      try {
        if (response) {
          setIsLogin(false);
          navigate("/popup.html");
        }
      } catch {
        console.log("error");
      }
    });
  };

  return (
    <div className="mb-2">
      <button id="login" onClick={isLogin ? handleLogout : handleLogin}>
        {isLogin ? "Logout" : " Sign in with Google"}
      </button>
      <p id="user-info"></p>
    </div>
  );
};

export default Google;
