import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
      });
  }

  get fval(): any{
    return this.form.controls;
  }

  onFormSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
    return;
    }
    this.loading = true;
    this.authService.SignIn(this.fval.email.value, this.fval.password.value);
    }

  signUp(): void {
    this.router.navigate(['/register'], { relativeTo: this.route });
  }

  googleSignin(): void {
    this.authService.GoogleAuth();
  }

}
