import express from "express";
import Thread from "../models/Thread.js";
const router = express.Router();
import OpenAiResponse from "../utils/openai.js";
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "12345",
      title: "Test Thread",
    });
    const response = await thread.save();
    res.send(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/threads", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/threads/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/threads/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const result = await Thread.findOneAndDelete({ threadId });
    if (!result) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chats", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "threadId and message are required" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const assistantResponse = await OpenAiResponse(message);
    thread.messages.push({ role: "assistant", content: assistantResponse });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistantResponse });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "this is eror" });
  }
});

export default router;
