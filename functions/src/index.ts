import {onRequest} from "firebase-functions/v2/https";
import express, {Request, Response} from "express";
import cors from "cors";


// Autorise UNIQUEMENT cette origine :
const allowedOrigin = "https://job4you-78ed0.web.app";
const appKeys = express();
appKeys.use(cors({origin: true}));
appKeys.use(
  cors({origin: allowedOrigin, //
    credentials: true})// (optionnel) si tu utilises les cookies
);

appKeys.get("/", async (req: Request, res: Response) => {
  res.status(200).send("Hello from Firebase!");
});


export const keys =onRequest({region: "europe-west1"}, appKeys);

