import {onRequest} from "firebase-functions/v2/https";
import express, {Request, Response} from "express";
import cors from "cors";
import {environmentKeys} from "./environnement_keys";


// Autorise UNIQUEMENT cette origine :
const allowedOrigins = ["https://job4you-78ed0.web.app", "http://localhost:4200"];

const appKeys = express();
appKeys.use(cors({origin: true}));

appKeys.use(
  cors({
    origin: function(origin, callback) {
      // Autorise les requêtes sans origin (ex: Postman) ou celles de la liste
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("BG Not allowed by CORS"));
      }
    },

    credentials: true, // Autorise l'envoi des cookies
  })
);


appKeys.get("/", async (req: Request, res: Response) => {
  res.status(200).send(environmentKeys);
});

/* url d'accès :
   https://europe-west1-job4you-78ed0.cloudfunctions.net/keys
*/
export const keys =onRequest({region: "europe-west1"}, appKeys);

