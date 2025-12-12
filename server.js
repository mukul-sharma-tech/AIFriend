
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve static files from public folder

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// app.post("/chat", async (req, res) => {
//     const { message } = req.body;

//     try {
//         const chat = model.startChat({ history: [] });
//         const result = await chat.sendMessage(message);
//         const responseText = result.response.text();

//         res.json({ response: responseText });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Something went wrong!" });
//     }
// });

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

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});
