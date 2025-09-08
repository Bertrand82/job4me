import express, {Request, Response} from "express";
import cors from "cors";
import {environmentKeysBack} from "./environnement_keys_back";
import {bgCors} from "./BgCors";
// Autorise UNIQUEMENT cette origine :

export const appKeys = express();
appKeys.use(cors({origin: true}));

// Configuration CORS personnalisée
appKeys.use(
  bgCors
);

appKeys.get("/", async (req: Request, res: Response) => {
  res.status(200).send(environmentKeysBack);
});
