import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      gender: [''],
      dob: [''],
      country: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }
  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const userData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      gender: this.registerForm.value.gender,
      dob: this.registerForm.value.dob,
      country: this.registerForm.value.country
    };

    this.authService.register(userData, this.registerForm.value.password).subscribe(
      () => {
        console.log('Registration successful');
        this.router.navigateByUrl('/login');
      },
      (error) => {
        console.error('Registration error:', error);
      }
    );
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}