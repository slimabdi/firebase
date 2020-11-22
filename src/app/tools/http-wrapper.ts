import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import {Observable} from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AngularFireAuth) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.auth.idToken.pipe(
        mergeMap((token: any) => {
          if (token) {
            console.log(token);
            request = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
          }
          return next.handle(request);
      }));
  }
}
