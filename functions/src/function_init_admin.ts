import express, {Request, Response} from "express";
import cors from "cors";
import {environmentKeysBack} from "./environnement_keys_back";
import {bgCors, allowedOrigins} from "./BgCors";
import * as admin from "firebase-admin";
// Autorise UNIQUEMENT cette origine :

export const functionInitAdmin = express();
functionInitAdmin.use(cors({origin: allowedOrigins}));

// Configuration CORS personnalisée
functionInitAdmin.use(bgCors);

functionInitAdmin.get("/", async (req: Request, res: Response) => {
  console.log("Requête initAdmin reçue :", req.body);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({error: "No token provided BGB"});
    return;
  }
  const idToken = authHeader.split("Bearer ")[1];
  try {
    // Vérification du token
    admin.initializeApp();
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid; // <--- l'user id ici

    res.json({uid: userId, decodedToken: decodedToken});
  } catch (error) {
    // eslint-disable-next-line max-len
    const errorMessage = error instanceof Error ? error.message : String(error);
    // eslint-disable-next-line max-len
    res.status(401).json({label: "Exception BGA", errorDetail: errorMessage});
  }
  res.status(200).json({message: "BINGO bg GET initAdmin idToken", idToken});
  res.status(200).send(environmentKeysBack);
});
