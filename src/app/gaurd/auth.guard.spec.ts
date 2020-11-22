import { TestBed, inject, getTestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import 'rxjs/observable/of';

import { AuthService } from '../shared/services/auth.service';
import { environment } from '../../environments/environment';
import {User} from '../shared/services/user';



const authState: User = {
  uid: '17WvU2Vj58SnTz8v7EqyYYb0WRc2',
  email: 'slimabdi@live.com',
  displayName: '25339046az',
  photoURL: 'string',
  emailVerified: true,
};

const collectionSpy = jasmine.createSpyObj({
  valueChanges: of(authState)
});

const afSpy = jasmine.createSpyObj('AngularFirestore', {
  collection: collectionSpy
});

describe('AuthGuard', () => {
  let injector: TestBed;
  let authService: AuthService;
  let guard: AuthGuard;
  const routeMock: any = { snapshot: {}};
  const routeStateMock: any = { snapshot: {}, url: '/chats'};
  const routerMock = {navigate: jasmine.createSpy('navigate')};

  beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [AuthGuard,
      { provide: Router, useValue: routerMock },
      { provide: AngularFireAuth, seValue: afSpy },
      { provide: AuthService }
    ],
    imports: [HttpClientTestingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
  });
  injector = getTestBed();
  authService = injector.inject(AuthService);
  guard = injector.inject(AuthGuard);
});

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect an unauthenticated user to the login route', () => {
    spyOn(authService, 'SignOut').and.resolveTo();
    expect(guard.canActivate(routeMock, routeStateMock)).toBeTruthy();
  });

  it('should allow the authenticated user to access app', () => {
    spyOn(authService, 'isLoggedIn').and.returnValue(false);
    expect(guard.canActivate(routeMock, routeStateMock)).toBeTruthy();
  });
});
