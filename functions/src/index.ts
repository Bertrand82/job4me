import {onRequest} from "firebase-functions/v2/https";
import {functionProxiGemini} from "./function_proxi_gemini";
import {appKeys} from "./function_keys";
import {functionInitAdmin} from "./function_init_admin";

/* url d'accès :
   https://europe-west1-job4you-78ed0.cloudfunctions.net/keys
   https://europe-west1-job4you-78ed0.cloudfunctions.net/gemini
   https://europe-west1-job4you-78ed0.cloudfunctions.net/initadmin
*/
export const keys = onRequest({region: "europe-west1"}, appKeys);
export const gemini = onRequest({region: "europe-west1"}, functionProxiGemini);
export const initadmin = onRequest({region: "europe-west1"}, functionInitAdmin);

