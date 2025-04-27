import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
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
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  get name() { return this.registerForm.get('name') as FormControl; }
  get email() { return this.registerForm.get('email') as FormControl; }
  get password() { return this.registerForm.get('password') as FormControl; }
  get confirmPassword() { return this.registerForm.get('confirmPassword') as FormControl; }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registering...'
    });
    await loading.present();

    const userData = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      gender: this.registerForm.value.gender,
      dob: this.registerForm.value.dob,
      country: this.registerForm.value.country
    };

    this.authService.register(userData, this.registerForm.value.password).subscribe(
      async () => {
        loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Registration Successful',
          message: 'You can now login with your email and password',
          buttons: ['OK']
        });
        await alert.present();
        
        this.router.navigateByUrl('/login');
      },
      async (error) => {
        loading.dismiss();
        
        const alert = await this.alertController.create({
          header: 'Registration Failed',
          message: error?.error?.message || 'An error occurred during registration',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}