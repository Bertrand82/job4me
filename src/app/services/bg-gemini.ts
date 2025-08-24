import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { environment_secret } from '../environments/environment_secret';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BgGemini {
  private apiUrl = `${environment.geminiApiUrl}`;

  constructor(private http: HttpClient) {}

  generateContent(prompt: string, responseShemaRequested:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': environment_secret.gk_d+environment_secret.gk_f
    });

    const body = {
      contents: [
        { parts: [{ text: prompt }] }
      ],
      generationConfig: {
      "responseMimeType":"application/json",
      "responseSchema": responseShemaRequested,
    }
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }

}
export const responseShemaGemini_v1 = {
  "type": "object",
  "properties": {

    "niveauDeCorrespondanceDe1A10": { "type": "number" },
    "lettreMotivation": { "type": "string" },
    "motsClésCommunsOffreEtCV": { "type": "string" }
  },
  "required": ["niveauDeCorrespondanceDe1A10", "lettreMotivation", "motsClésCommunsOffreEtCV"],
  "propertyOrdering": ["niveauDeCorrespondanceDe1A10", "lettreMotivation", "motsClésCommunsOffreEtCV"]
};

export const reponseAnalyseOffreEmploi = {
  "type": "object",
  "properties": {
    "cv.nom": { "type": "string", "description":"renseigne le nom de la personne identifiée dans le CV" },
    "cv.prenom": { "type": "string", "description":"renseigne le prénom de la personne identifiée dans le CV" },
    "cv.nationalite": { "type": "string", "description":"renseigne la nationalité de la personne identifiée dans le CV" },
    "cv.age": { "type": "number", "description":"renseigne l'âge de la personne identifiée dans le CV" },
    "cv.experience": { "type": "string", "description":"renseigne l'expérience de la personne identifiée dans le CV" },
    "langue": { "type": "string" , "enum": ["fr", "en"] },
    "offre.resume": { "type": "string" , "maxLength": 500 },
    "offre.societe": { "type": "string" ,"description":"renseigne le nom de la société identifiée dans l’offre"},
    "offre.personne": { "type": "string", "description":"renseigne le nom de la personne identifiée dans l’offre" },
    "offre.email": { "type": "string", "description":"renseigne l'email de la personne identifiée dans l’offre" },
    "offre.lieu": { "type": "string","description":"renseigne le lieu du poste identifié dans l’offre" },
    "offre.pays": { "type": "string","description":"renseigne le pays du poste identifié dans l’offre" },
    "offre.freelance": { "type": "boolean","description":"Dans l'offre d'emploi,précise si le poste est en freelance ou non" },
  },
  "required": ["langue", "resume", "societe", "personne", "lieu", "freelance"],
  "propertyOrdering": ["langue", "resume", "societe", "personne", "lieu", "freelance"]
};
