import {onRequest} from "firebase-functions/v2/https";
import express, {Request, Response} from "express";
import cors from "cors";
import axios from "axios";

// Autorise UNIQUEMENT cette origine :
const allowedOrigin = "https://job4you-78ed0.web.app";
const app = express();
app.use(cors({origin: true}));
app.use(
  cors({origin: allowedOrigin, //
    credentials: true})// (optionnel) si tu utilises les cookies
);

app.get("/", async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).json({error: "bg Missing url parameter"});
    return;
  }
  try {
    const response = await axios.get(targetUrl, {
      timeout: 5000,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === "string") res.setHeader(key, value);
    });

    res.status(response.status).send(response.data);
  } catch (error: unknown) {
    const messageErr1 = error instanceof Error ? error.message : String(error);
    const messageErr2 = "bg targetUrl: "+targetUrl;
    const message = messageErr1 + " " + messageErr2;
    console.error("bg1 Error fetching target URL:", error);
    console.error("bg2 Error fetching target URL:", message);
    res.status(500).json({error: message});
  }
});

export const proxyToDynamicUrl = onRequest({region: "europe-west1"}, app);
