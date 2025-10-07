/* eslint-disable max-len */
import {onRequest} from "firebase-functions/v2/https";
import {functionProxiGemini} from "./function_proxi_gemini";
import {appKeys} from "./function_keys";
import {functionInitAdmin} from "./function_init_admin";
import {functionBgStripeGetClient} from "./bgStripeGetClient";
import {functionBgStripeGetPayments} from "./bgStripeGetPayments";
import {functionBgStripeGetPaymentLink} from "./bgStripeGetPaymentLink";
import {functionBgStripeCreateCustomer} from "./bgStripeCreateCustomer";
import {functionBgStripeSearchClientsByBgUserId} from "./bgStripeSearchClientsByBgUserId";
import {functionBgStripeSearchClientsByBgUserIdOrCreateClient} from "./bgStripeSearchClientsByBgUserIdOrCreateClient";
import {functionBgStripeGetInvoiceFromPaymentIntent} from "./bgStripeGetInvoiceFromPaymentIntent";

/* url console firebase:
https://console.firebase.google.com/project/job4you-78ed0/functions
Project Console:
https://console.firebase.google.com/project/job4you-78ed0/overview
Console cloud:
https://console.cloud.google.com/run/detail/europe-west4/job4me/networking?project=job4you-78ed0
Authorisation fonction exemple :
https://console.cloud.google.com/run/detail/europe-west1/bgstripesearchclientsbybguseridorcreateclient/security?chat=true&project=job4you-78ed0
https://console.cloud.google.com/run?orgonly=true&project=job4you-78ed0&supportedpurview=organizationId
url d'accès :
   https://europe-west1-job4you-78ed0.cloudfunctions.net/keys
   https://europe-west1-job4you-78ed0.cloudfunctions.net/gemini
   https://europe-west1-job4you-78ed0.cloudfunctions.net/initadmin
   https://europe-west1-job4you-78ed0.cloudfunctions.net/bgstripe
*/
export const keys2 = onRequest({region: "europe-west1"}, appKeys);
export const gemini2 = onRequest({region: "europe-west1"}, functionProxiGemini);
export const initadmin2 = onRequest({region: "europe-west1"}, functionInitAdmin);
export const bgstripegetclient2 = onRequest({region: "europe-west1"}, functionBgStripeGetClient);
export const bgstripegetpayments2 = onRequest({region: "europe-west1"}, functionBgStripeGetPayments);
export const bgstripegetpaymentlink2 = onRequest({region: "europe-west1"}, functionBgStripeGetPaymentLink);
export const bgstripecreatecustomer2 = onRequest({region: "europe-west1"}, functionBgStripeCreateCustomer);
export const bgstripesearchclientsbybguserid2 = onRequest({region: "europe-west1"}, functionBgStripeSearchClientsByBgUserId);
export const bgstripesearchclientsbybguseridorcreateclient2 = onRequest({region: "europe-west1"}, functionBgStripeSearchClientsByBgUserIdOrCreateClient);
export const bgstripegetinvoicefrompaymentintent2 = onRequest({region: "europe-west1"}, functionBgStripeGetInvoiceFromPaymentIntent);
