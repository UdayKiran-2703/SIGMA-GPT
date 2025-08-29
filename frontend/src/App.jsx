import "./App.css";
import Sidebar from "./sidebar.jsx";
import ChatWindow from "./chatWindow.jsx";
import MyContext from "./myContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [newChat, setNewChat] = useState(true);
  const [prevChat, setPrevChat] = useState([]);
  const [latestReply, setLatestReply] = useState(null);
  const [allThreads, setAllThreads] = useState([]);

  const productValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChat,
    setPrevChat,
    latestReply,
    setLatestReply,
    allThreads,
    setAllThreads,
  };

  return (
    <Router>
      <MyContext.Provider value={productValues}>
        <Routes>
          {/* Default route → redirect to /chat */}
          <Route path="/" element={<Navigate to="/chat" replace />} />

          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected chat route */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <div className="app">
                  <Sidebar />
                  <ChatWindow />
                </div>
              </PrivateRoute>
            }
          />

          {/* 404 fallback */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </MyContext.Provider>
    </Router>
  );
}

export default App;
