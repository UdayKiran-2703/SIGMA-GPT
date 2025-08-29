import "./chatWindow.css";
import Chat from "./chat.jsx";
import MyContext from "./myContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom"; // 👈 import navigate

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    setPrevChat,
    setNewChat,
    prevChat,
  } = useContext(MyContext);

  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // 👈 navigation hook

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/login"); // redirect to login
  };

  let getReply = async () => {
    setLoader(true);
    setNewChat(false);

    const token = localStorage.getItem("token"); // 👈 add token
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 send token
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chats", options);
      const res = await response.json();
      setReply(res.reply);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
    setLoader(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChat((prevChat) => [
        ...prevChat,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  const handleProfile = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-arrow-down"></i>
        </span>
        <div className="userIconDiv">
          <span>
            <i
              className="fa-solid fa-circle-user userIcon"
              onClick={handleProfile}
            ></i>
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="dropdown">
          <div className="dropdowns">
            <i className="fa-solid fa-gear"></i> Settings
          </div>
          <div className="dropdowns">
            <i className="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan
          </div>
          <div className="dropdowns" onClick={handleLogout}>
            {" "}
            {/* 👈 add logout handler */}
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </div>
        </div>
      )}

      <Chat />
      <ScaleLoader color="#fff" loading={loader} />

      <div className="chatInput">
        <div className="InputBox">
          <input
            placeholder="Ask Anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
