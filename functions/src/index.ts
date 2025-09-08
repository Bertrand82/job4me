import {onRequest} from "firebase-functions/v2/https";
import {functionProxiGemini} from "./function_proxi_gemini";
import {appKeys} from "./function_keys";

/* url d'accès :
   https://europe-west1-job4you-78ed0.cloudfunctions.net/keys
   https://europe-west1-job4you-78ed0.cloudfunctions.net/gemini
*/
export const keys =onRequest({region: "europe-west1"}, appKeys);
export const gemini = onRequest({region: "europe-west1"}, functionProxiGemini);

