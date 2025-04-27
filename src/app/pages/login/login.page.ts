import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Use these getters to safely access form controls
  get email(): AbstractControl | null { 
    return this.loginForm.get('email');
  }
  
  get password(): AbstractControl | null { 
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const emailValue = this.email?.value;
    const passwordValue = this.password?.value;

    if (emailValue && passwordValue) {
      this.authService.login(emailValue, passwordValue)
        .subscribe(
          () => {
            this.router.navigateByUrl('/dashboard');
          },
          (error) => {
            console.error('Login error:', error);
          }
        );
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }
}