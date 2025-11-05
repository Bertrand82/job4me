/* Déclare globalement l'objet google fourni par https://accounts.google.com/gsi/client */
declare global {
  interface Window { google?: any; }
  const google: any;
}
export {};