import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastrModule } from 'ngx-toastr';

import { LoginComponent } from './login.component';
import { AuthService } from '../../shared/services/auth.service';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

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

const routerSpy = jasmine.createSpyObj('Router', ['routes']);

const loginServiceSpy = jasmine.createSpyObj('AuthService', ['SignIn']);


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        AngularFireModule.initializeApp(environment.firebaseConfig)
      ],
      providers: [
        FormBuilder,
        { provide: AngularFireAuth, seValue: afSpy },
        {provide: AuthService, useValue: loginServiceSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function updateForm(userEmail: string, userPassword: string): void {
    component.form.controls.email.setValue(userEmail);
    component.form.controls.password.setValue(userPassword);
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.submitted).toBeFalsy();
    expect(component.form).toBeDefined();
    expect(component.form.invalid).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });



  it('should call auth login method', waitForAsync(() => {
    const debugElement = fixture.debugElement;
    const authService = debugElement.injector.get(AuthService);
 /*    const loginSpy = spyOn(authService , 'SignIn').and.callThrough();
    loginElement = fixture.debugElement.query(By.css('form')); */
    // to set values
    component.form.controls.email.setValue('slimabdi@live.com');
    component.form.controls.password.setValue('25339046az');
    authService.SignIn('slimabdi@live.com', '25339046az');
    console.log(authService.isLoggedIn);
    expect(authService.user$).toBeTruthy();
   }));

  it('submitted should be true when onSubmit()', () => {
    component.onFormSubmit();
    expect(component.submitted).toBeTruthy();
    expect(component.loading).toBeFalsy();
  });

  it('form value should update from when u change the input', (() => {
    updateForm(authState.email, authState.password);
    expect(component.form.value).toBeTruthy();
  }));

  it('should route to chat if login successfully' , fakeAsync(() => {
    updateForm(authState.email, authState.password);
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('button');
    button.click();
    fixture.detectChanges();
    advance(fixture);
    expect(routerSpy.routes).toBeTruthy();
  }));

  function advance(f: ComponentFixture<any>): void {
    tick();
    f.detectChanges();
  }
});
