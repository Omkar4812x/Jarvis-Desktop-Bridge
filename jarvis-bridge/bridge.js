// FINAL JARVIS BRIDGE - OpenRouter API Integration
// Node.js server for OpenRouter AI connectivity

const http = require("http");
const PORT = 3000;

// OpenRouter Configuration
const OPENROUTER_API_KEY = "YOUR_OPENAI_API_KEY"; // Your API key
const MODEL = "google/gemma-2-9b-it";

console.log("=== LOADING FINAL JARVIS BRIDGE ===");

http.createServer(async (req, res) => {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/ask") {
    let body = "";
    
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { prompt, creatorName = "Omkar Sir" } = JSON.parse(body);
        console.log("🧠 Processing prompt:", prompt);
        
        // Call OpenRouter API
        const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://jarvis-ai.local",
            "X-Title": "JARVIS AI Assistant"
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content: `You are JARVIS, an AI assistant created by ${creatorName}. Respond professionally and concisely.`
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 150
          })
        });

        if (openRouterResponse.ok) {
          const data = await openRouterResponse.json();
          const aiResponse = data.choices[0].message.content.trim();
          
          console.log("✅ OpenRouter success:", aiResponse);
          
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ 
            reply: `🧠 ${aiResponse}`,
            source: "openrouter"
          }));
        } else {
          // Fallback to local response
          const localResponse = getLocalFallback(prompt, creatorName);
          console.log("💾 Local fallback:", localResponse);
          
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ 
            reply: localResponse,
            source: "local"
          }));
        }
      } catch (error) {
        console.error("💥 Bridge error:", error.message);
        
        // Emergency local response
        const emergencyResponse = getEmergencyResponse();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ 
          reply: emergencyResponse,
          source: "emergency"
        }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
}).listen(PORT, () => {
  console.log(`✅ Jarvis Bridge Running on http://localhost:${PORT}`);
  console.log(`🔑 Using OpenRouter API with key: ${OPENROUTER_API_KEY.substring(0, 15)}...`);
});

// Local fallback responses
function getLocalFallback(prompt, creatorName) {
  const p = prompt.toLowerCase().trim();
  
  if (p.includes("time") || p.includes("clock")) {
    return `🕐 ${new Date().toLocaleTimeString()} - ${new Date().toDateString()}`;
  }
  
  if (p.includes("created") || p.includes("creator")) {
    return `👨‍💻 I was created by ${creatorName}, my brilliant designer.`;
  }
  
  if (p.includes("status") || p.includes("system")) {
    return `✅ All systems operational, ${creatorName}. Bridge connected to OpenRouter.`;
  }
  
  if (p.includes("hello") || p.includes("hi")) {
    return `👋 Hello, ${creatorName}. JARVIS bridge ready.`;
  }
  
  const responses = [
    `✅ Acknowledged, ${creatorName}.`,
    `🎯 Understood, ${creatorName}.`,
    `📡 Affirmative, ${creatorName}.`,
    `📋 Ready, ${creatorName}.`
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function getEmergencyResponse() {
  return "✅ Bridge operational. Emergency response system active.";
}