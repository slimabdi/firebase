import { TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import 'rxjs/observable/of';

import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import {User} from './user';


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


describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AngularFireModule.initializeApp(environment.firebaseConfig)],
      providers: [
        { provide: AngularFireAuth, seValue: afSpy },
        { provide: AuthService }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
