import cors from "cors";

// Autorise UNIQUEMENT cette origine :
const allowedOrigins = [
  "https://job4you-78ed0.web.app",
  "http://localhost:4200",
];

export const bgCors = cors({
  origin: function(origin, callback) {
    // Autorise les requêtes sans origin (ex: Postman) ou celles de la liste
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("BG Not allowed by CORS"));
    }
  },
  credentials: true, // Autorise l'envoi des cookies
});
