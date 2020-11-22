import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../../shared/services/auth.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

import { VerifyEmailComponent } from './verify-email.component';

const authState = {
  uid: 'Ib1QpQALQXkQgonmwgWtoypefE2',
  email: 'slimabdi@live.com',
  password: '25339046az',
};

const collectionSpy = jasmine.createSpyObj({
  valueChanges: of(authState)
});

const afSpy = jasmine.createSpyObj('AngularFirestore', {
  collection: collectionSpy
});

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyEmailComponent ],
      imports: [
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      providers: [
        { provide: AngularFireAuth, seValue: afSpy },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
