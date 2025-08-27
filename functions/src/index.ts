import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import axios from "axios";
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

export const helloWorld = onRequest((request, response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

export const helloWorld2 = onRequest({region: "europe-west1"}, (req, res) => {
  res.send("Hello from Firebase Europe!");
});

// eslint-disable-next-line max-len
export const proxyToDynamicUrl = onRequest({region: "europe-west1"}, async (req, res) => {
  // Vérifier que la méthode est bien GET
  if (req.method !== "GET") {
    res.status(405).json({error: "Only GET method is allowed."});
    return;
  }

  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    res.status(400).json({error: "Missing url parameter"});
    return;
  }

  try {
    // Effectuer la requête GET vers l'URL cible
    const response = await axios.get(targetUrl, {
      // Optionnel: transmettre certains headers si besoin
      headers: {
        "bg": "bgProxy",
        // ...tu peux ajouter ici des headers à forward
      },
    });

    // Retourner la réponse au client
    res.status(response.status).set(response.headers).send(response.data);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
});
