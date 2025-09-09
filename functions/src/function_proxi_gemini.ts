import express, {Request, Response} from "express";
import cors from "cors";
// import {bgCors} from "./BgCors";

// Initialize express app
export const functionProxiGemini = express();

// Enable CORS for all origins
functionProxiGemini.use(cors({origin: true}));
// functionProxiGemini.use(bgCors);
// Parse JSON bodies (for POST requests)
functionProxiGemini.use(express.json());

// POST endpoint at /bg4
functionProxiGemini.post("/", (req: Request, res: Response) => {
  // Respond with a fixed string
  console.log("Requête reçue :", req.body);
  const authorization = req.headers.authorization;
  res.status(200).json({message: "Réponse bg POST /gemini", authorization});
});

// Export as Firebase HTTPS function

