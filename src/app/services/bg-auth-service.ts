import { Injectable, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  sendPasswordResetEmail,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class BgAuthService {
  private userSignal = signal<User | null>(null);

  constructor(public auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.userSignal.set(user);
    });
  }

  get currentUser() {
    return this.userSignal.asReadonly();
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login(email: string, password: string) {
    console.log('AAA Tentative de connexion avec email :', email);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  sendPasswordResetEmail2(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then((result) => {
        // L'utilisateur est connecté
        const user = result.user;
        console.log('Connecté :', user.email);
      })
      .catch((error) => {
        console.error('Erreur lors de la connexion :', error);
        window.alert(error.message);
      });
  }
}
