import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent';
  private apiKey = 'YOUR_API_KEY'; // Remplace par ta clé Google AI

  constructor(private http: HttpClient) {}

  async analyzeImage(prompt: string, file: File): Promise<string> {
    // Convertir le fichier en base64
    const base64 = await this.readFileAsBase64(file);

    // Construire la payload REST
    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: file.type,
                data: base64
              }
            }
          ]
        }
      ]
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Appel REST Gemini
    return this.http.post<any>(
      `${this.apiUrl}?key=${this.apiKey}`,
      body,
      { headers }
    ).toPromise().then(res => {
      // Adapter selon la structure de la réponse
      return res?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    });
  }

  private readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Supprime le préfixe "data:xxx;base64,"
        const result = (reader.result as string);
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
