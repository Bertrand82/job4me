```markdown
# Angular Gmail read-only with GIS (no gapi)

Intégration de  Google Identity Services (GIS) dans app Angular pour obtenir l'accès  à Gmail via les APIs REST (sans gapi). Fournit un service réutilisable pour s'authentifier et appeler les endpoints Gmail REST.

Points clés :
- Utilise le token client GIS (google.accounts.oauth2.initTokenClient).
- Appelle les endpoints HTTP REST de Gmail (`https://gmail.googleapis.com/...`) avec `Authorization: Bearer <access_token>`.
- N'inclut pas `gapi`.
- Requiert d'activer l'API Gmail et de créer un Client ID OAuth 2.0 pour applications web dans Google Cloud Console.(Google Cloud Console)[https://console.cloud.google.com/welcome?project=job4you-78ed0]

Important — recommandations :
- Pour des accès long terme / refresh tokens stockés, préférez Authorization Code + PKCE avec un échange côté serveur. Le token client côté client ne délivre pas de refresh token durable.
- Toujours limiter les scopes au minimum requis — ici `https://www.googleapis.com/auth/gmail.readonly`.
```
