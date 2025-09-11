import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { KeysService } from './bg-environment-keys-service';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiMultiModaleServiceDirect {
  private apiUrl_OLD = environment.geminiApiUrlMultimodal;

  constructor(private http: HttpClient, private keysService: KeysService) {}

  getApiKey(): string {
    return this.keysService.getKeys().gk_d + this.keysService.getKeys().gk_f;
  }

  async analyzeFileImage(prompt: string, file: File): Promise<any> {
    // Convertir le fichier en base64
    const base64 = await readFileAsBase64(file);
    const obs = this.analyseFileImageBase64(prompt, base64, file.type, reponseAnalyseCVMultimodal);
  }

  analyseFileImageBase64(
    prompt: string,
    base64: string,
    fileType: string,
    schemaResponseRequested: any
  ): Observable<any> {
    // Construire la payload REST
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: fileType,
                data: base64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schemaResponseRequested,
      },
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const apiKey = this.getApiKey();
    // Appel REST Gemini
    const urlMultimodal = environment.geminiApiUrlMultimodal + `?key=${apiKey}`;
    console.log('Gemini models  urlMultimodal : ', urlMultimodal);
    return this.http.post<any>(urlMultimodal, body, {
      headers,
    });
  }

  listModels() {
    this.getModels().subscribe(
      (res) => {
        console.log('Gemini models response  AAA:', res);
        console.log('Gemini models response: BBB: ', res.models);
        const models: any[] = res.models;
        const multimodalModels = models.filter(
          (model) =>
            model.description &&
            model.description.toLowerCase().includes('multimodal')
        );
        console.log(
          'Gemini models response miltimodal BBB: :',
          multimodalModels
        );
        for (let i = 0; i < multimodalModels.length; i++) {
          console.log(
            'Gemini models response  CCC ' + i + ':',
            multimodalModels[i]
          );
        }
      },
      (error) => {
        console.error('Gemini models error:', error);
      }
    );
  }

  getModels(): Observable<any> {
    const apiKey = this.getApiKey();
    const apiurl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    return this.http.get(apiurl);
  }
}

export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Supprime le préfixe "data:xxx;base64,"
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}


export const reponseAnalyseCVMultimodal = {
  type: 'object',
  properties: {
    'cv.content': { type: 'string', description: 'contenu litteral brut du cv, sans ajout ni retrait    ' },
    'cv.titre': {
      type: 'string',
      description:
        "récupérer le titre du cv ou si il n'y en a pas, générer un titre résumant le cv",
    },
    'cv.resume': { type: 'string', maxLength: 100, description: 'résumé du cv' },
    'cv.societes': {
      type: 'array',
      items: { type: 'string' },
      description: 'liste des noms des societes apparaissant dans le cv',
    },
    'cv.skills': {
      type: 'array',
      items: { type: 'string' },
      description: 'liste des compétences du cv',
    },
    'cv.personne': {
      type: 'string',
      description: 'renseigne le nom de la personne identifiée dans l’offre',
    },
    'cv.email': {
      type: 'string',
      description: "renseigne l'email de la personne identifiée dans l’offre",
    },
    'cv.nationalité': {
      type: 'string',
      description: 'renseigne la nationalité du candidat',
    },
    'cv.adresse': {
      type: 'string',
      description: 'adresse postale du candidat',
    },
    'cv.freelance': {
      type: 'boolean',
      description:
        "est ce que le candidat est  freelance",
    },
    'cv.langues': {
      type: 'array',
      items: { type: 'string', enum: ['fr', 'en', 'es'] },
      description: 'renseigne les langues du cv',
    },
    'cv.langue': {
      type: 'string',
      enum: ['fr', 'en', 'es'],
      description: 'renseigne la langue du cv',
    },
    'cv.isCV': {
      type: 'boolean',
      description: 'Indique si le document est bien un CV',
    },
  },
  required: [
    'cv.titre',
    'cv.resume',
    'cv.langue',
    'cv.societes',
    'cv.personne',
    'cv.email',
    'cv.nationalité',
    'cv.adresse',
    'cv.freelance',
  ],
};
