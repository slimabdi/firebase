import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
// import { User } from 'firebase';
import {TokenInterceptor} from '../../tools/http-wrapper';
import { Observable, of } from 'rxjs';
import { switchMap, first } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User>;
  userData: any; // Save logged in user data
  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router,
    private ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */
    this.angularFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  getUser(): Promise<any> {
    return this.user$.pipe(first()).toPromise();
  }

  // Sign in with email/password
  SignIn(email: string, password: string): Promise<any> {
    return this.angularFireAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(this.isLoggedIn);
        this.ngZone.run(() => {
          this.router.navigate([`chats/${result.user.uid}`]);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email, password): Promise<void> {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail(): Promise<void> {
    return this.angularFireAuth.currentUser.then(u => u.sendEmailVerification())
    .then(() => {
      this.router.navigate(['verify-email-address']);
    });
  }

   /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  private SetUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

    // Reset Forggot password
    ForgotPassword(passwordResetEmail): Promise<any> {
      return this.angularFireAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error);
      });
    }

      // Returns true when user is looged in and email is verified
    isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user'));
      return (user !== null && user.emailVerified !== false);
    }

      // Sign in with Google
  GoogleAuth(): Promise<any> {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  async googleSignin(): Promise<any> {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.angularFireAuth.signInWithPopup(provider);
    return this.SetUserData(credential.user);
  }
  // Auth logic to run auth providers
  AuthLogin(provider): Promise<any> {
    return this.angularFireAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
        this.router.navigate([`chats/${result.user.uid}`]);
        });
       this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error);
    });
  }

  SignOut(): Promise<any> {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    });
  }
}
