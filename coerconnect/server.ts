import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/planner/generate", async (req, res) => {
    const { city, budget, duration } = req.body;

    if (!city || !budget || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const prompt = `Anda adalah "Coer Space Assistant", konsultan perencana acara khusus untuk fandom Coer (penggemar boygroup Cortis).
      Member Cortis: Martin (Leader), James, Juhoon, Seonghyeon, dan Keonho.
      Lagu: 'AÇAÍ', 'What You Want', 'FaSHioN'.
      Album: 'Color Outside the Lines', 'GREENGREEN' (lime/neon accent), 'REDRED'.
      Tur: "<PUT YOUR PHONE DOWN>".

      Tugas: Buat rencana perjalanan konser yang detail berdasarkan data berikut:
      - Kota Tujuan: ${city}
      - Anggaran: Rp ${budget}
      - Durasi: ${duration} hari

      Format Output: WAJIB JSON murni tanpa markdown, sesuai skema berikut:
      {
        "status": "success",
        "concert_summary": { "target_location": "...", "estimated_days": ${duration}, "total_budget_needed": "..." },
        "budget_allocation": [ { "category": "...", "cost": 0, "percentage": 0, "notes": "..." } ],
        "itinerary": [ { "day": 1, "activities": [ { "time": "09:00", "activity": "...", "tips": "..." } ] } ],
        "dresscode_recommendations": { "concept": "...", "items": ["...", "..."], "color_palette": ["...", "..."] },
        "concert_kit_checklist": [ { "item": "...", "urgency": "Wajib/Opsional" } ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const plan = JSON.parse(response.text || "{}");
      res.json(plan);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ error: "Gagal membuat rencana perjalanan" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express v4, use '*'
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
