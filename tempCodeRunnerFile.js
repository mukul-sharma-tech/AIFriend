app.post("/chat", async (req, res) => {
    const { message } = req.body;
  
    if (message.toLowerCase().startsWith("open ")) {
      const query = message.toLowerCase().replace("open ", "").trim();
      const domain = query.replace(/\s+/g, ""); // Remove spaces
  
      // Construct a direct URL and fallback search URL
      const directUrl = `https://${domain}com`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  
      // Send both options to the frontend
      return res.json({
        response: `Opening ${query}...`,
        openUrl: directUrl,
        fallbackUrl: searchUrl,
      });
    }
  
    try {
      const chat = model.startChat({ history: [] });
      const result = await chat.sendMessage(message);
      const responseText = result.response.text();
      res.json({ response: responseText });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong!" });
    }
  });
  

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "head.html"));
});