import "./sidebar.css";
import { useEffect, useContext } from "react";
import MyContext from "./myContext";
import { v4 as uuidv4 } from "uuid";
function Sidebar() {
  const {
    currThreadId,
    allThreads,
    setAllThreads,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChat,
    prevChat,
  } = useContext(MyContext);
  let getAllThreads = async () => {
    try {
      let res = await fetch("http://localhost:5000/api/threads");
      const response = await res.json();
      let filteredData = response.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Fetch all threads from API and store them in the state
    // setAllThreads(fetchedThreads);
    getAllThreads();
  }, [currThreadId]);
  let createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv4());
    setPrevChat([]);
  };
  let changeThread = async (newthreadId) => {
    setCurrThreadId(newthreadId);

    try {
      let res = await fetch(`http://localhost:5000/api/threads/${newthreadId}`);
      const response = await res.json();
      console.log(response);
      setPrevChat(response);
      console.log(prevChat);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };
  let deleteThread = async (threadId) => {
    try {
      let res = await fetch(`http://localhost:5000/api/threads/${threadId}`, {
        method: "DELETE",
      });
      const response = await res.json();
      console.log(response);
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="sidebar">
      <button>
        <img src="src/assets/blacklogo.png" alt="error" className="logo"></img>
        <span>
          <i
            className="fa-solid fa-pen-to-square big"
            onClick={createNewChat}
          ></i>
        </span>
      </button>
      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li
            key={idx}
            onClick={(e) => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>
      <div className="sign">
        <p>By Apna College &hearts;</p>
      </div>
    </section>
  );
}
export default Sidebar;
