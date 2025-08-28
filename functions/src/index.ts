import {onRequest} from "firebase-functions/v2/https";
import express from "express";
import cors from "cors";
import axios from "axios";
import {Request, Response} from "express";

const app = express();
app.use(cors({origin: true}));

app.get("/", async (req: Request, res: Response) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).json({error: "Missing url parameter"});
    return;
  }
  try {
    const response = await axios.get(targetUrl, {
      headers: {
        bg: "bgProxy",
      },
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    Object.entries(response.headers).forEach(([key, value]) => {
      if (typeof value === "string") res.setHeader(key, value);
    });

    res.status(response.status).send(response.data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({error: message});
  }
});

export const proxyToDynamicUrl = onRequest({region: "europe-west1"}, app);
