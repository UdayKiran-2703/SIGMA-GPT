import "dotenv/config";

const OpenAiResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
    }),
  };

  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();

    // Return just the assistant's reply
    return data.choices[0].message.content;
  } catch (err) {
    console.error("OpenAI API error:", err);
    throw new Error("Failed to get response from OpenAI");
  }
};

export default OpenAiResponse;
