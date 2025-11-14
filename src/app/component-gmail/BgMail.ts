export class BgMail {
  id: string;
  from?: string;
  fromShort?: string;
  subject?: string;
  snippet?: string;
  bodyTxt?: string;
  geminiResponse?: GeminiResponse;
  constructor(
    id: string,
    from?: string,
    subject?: string,
    snippet?: string,
    bodyTxt?: string,
    geminiResponse?: GeminiResponse
  ) {
    this.id = id;
    this.setFrom(from);
   
    this.subject ||= subject;
    this.snippet ||= snippet;
    this.bodyTxt ||= bodyTxt;
    this.geminiResponse ||= geminiResponse;
    
  }

  public setFrom(from?:string): void {
    this.from = from;
    this.fromShort = extractDisplayName(from) ;
  } 
  public toString2(): string {
    if (!this.subject && this.bodyTxt) {
      return this.id;
    } else {

      return "Object:  " + this.subject;
    }

  }


  public isOffreEmploi(): boolean {
    if (this.geminiResponse === undefined) {
      return false;
    }
    if (this.geminiResponse.isJobOffer) {
      const isJobOffer = this.geminiResponse.isJobOffer;
      return typeof isJobOffer === 'boolean' && isJobOffer;
    }
    return false;
  }

  public getBackgroundColor(): string {
    if (this.geminiResponse === undefined) {
      return '#ffffff';;
    }
    if (this.isOffreEmploi()) {
      return '#0e7a27ff'; // vert clair pour les offres d'emploi
    } else if (this.isPriseDeContact()) {
      return '#d61b1eff'; // jaune clair pour les prises de contact
    } else {
      return '#f8d7da'; // rouge clair pour les autres types de mails
    }
  }
  public isPriseDeContact(): boolean {
    if (this.geminiResponse === undefined) {
      return false;
    }
    if (this.geminiResponse.isPriseDeContact) {
      const isPriseDeContact = this.geminiResponse.isPriseDeContact;
      return typeof isPriseDeContact === 'boolean' && isPriseDeContact;
    }
    return false;
  }
}


export class GeminiResponse {

  isJobOffer: boolean = false;
  isPriseDeContact: boolean = false;
  company: string | undefined;
  position: string | undefined;
  salary: string | undefined;
  location: string | undefined;
  contact: string | undefined;
  applyLink: string | undefined;
  offerDate: string | undefined;

}



  function extractDisplayName(raw: string | undefined): string |undefined{
  if (!raw) return raw;

  // Prendre le premier élément si plusieurs adresses (garde les guillemets ensemble)
  const first = raw.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)[0].trim();

  // Si format "Nom <email>", prendre la partie avant '<'
  const ltIndex = first.indexOf('<');
  let namePart = ltIndex !== -1 ? first.slice(0, ltIndex).trim() : first;

  // Enlever quotes autour du nom
  namePart = namePart.replace(/^"(.*)"$/, '$1').trim();

  // Enlever commentaires finaux comme "Nom (Société)"
  namePart = namePart.replace(/\s*\(.*\)$/, '').trim();

  // Si namePart vide ou contient un email (pas de nom), extraire la partie locale de l'email
  if (!namePart || /@/.test(namePart)) {
    const m = first.match(/([^<>@\s]+)@/);
    return m ? m[1] : raw;
  }

  // Décoder les mots encodés RFC2047 s'il y en a
  return decodeMimeWords(namePart);
}

function decodeMimeWords(str: string): string {
  // Remplace toutes les occurrences =?charset?B?base64?= ou =?charset?Q?qp?=
  return str.replace(/=\?([^?]+)\?([bqBQ])\?([^?]+)\?=/g, (_match, charset, enc, encoded) => {
    enc = enc.toUpperCase();
    try {
      if (enc === 'B') {
        // Base64
        const binary = atob(encoded);
        if (typeof TextDecoder !== 'undefined') {
          const arr = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
          return new TextDecoder(charset).decode(arr);
        }
        return binary;
      } else {
        // Q-encoding (quot-printable like for headers)
        let q = encoded.replace(/_/g, ' ');
       // q = q.replace(/=([A-Fa-f0-9]{2})/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)));
        if (typeof TextDecoder !== 'undefined') {
          const arr = new Uint8Array(q.length);
          for (let i = 0; i < q.length; i++) arr[i] = q.charCodeAt(i);
          return new TextDecoder(charset).decode(arr);
        }
        return q;
      }
    } catch (e) {
      // En cas d'échec, retourne la chaîne encodée brute
      return encoded;
    }
  });
}