/* eslint-disable max-len */
import express, {Request, Response} from "express";
import cors from "cors";
import {allowedOrigins} from "./BgCors";
import * as admin from "firebase-admin";
import {environmentKeysBack} from "./environnement_keys_back";

// Assure-toi que ceci est appelé UNE fois dans ton projet !
admin.initializeApp();

export const functionProxiGemini = express();

// CORS
functionProxiGemini.use(cors({origin: allowedOrigins}));

// Parse JSON bodies
functionProxiGemini.use(express.json());

// POST endpoint
functionProxiGemini.post("/", async (req: Request, res: Response) => {
  console.log("Requête reçue :", req.body);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({error: "No token provided BGB"});
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    // Vérifie le token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    const apiKey = environmentKeysBack.gk_d + environmentKeysBack.gk_f;
    const urlMultimodal = environmentKeysBack.geminiApiUrlMultimodal + `?key=${apiKey}`;

    // Appel HTTP à Gemini
    const geminiResponse = await fetch(urlMultimodal, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(req.body),
    });

    // Récupère la réponse
    const geminiData = await geminiResponse.json();
    // Réponse
    return res.status(200).json({
      message: "BINGO bg POST idToken",
      idtoken: idToken,
      uid: userId,
      decodedToken: decodedToken,
      geminiData: geminiData,
    });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : String(error);
    return res.status(401).json({
      label: "Invalid token BGA",
      errorDetail: errorMessage,
      idtoken: idToken,
    });
  }
});
