import "./chat.css";
import MyContext from "./myContext";
import { useContext, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
function Chat() {
  const { newChat, prevChat, setNewChat, setPrevChat, reply } =
    useContext(MyContext);
  const { latestReply, setLatestReply } = useContext(MyContext);
  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChat?.length) return;
    const content = reply.split("");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(""));
      idx++;
      if (idx >= content.length) {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [prevChat, reply]);
  return (
    <>
      {newChat && <h1>Start a new Chat</h1>}
      <div className="chats">
        {prevChat?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={rehypeHighlight}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
        {prevChat.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key={"nottyping"}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {prevChat[prevChat.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gptDiv" key={"typing"}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default Chat;
