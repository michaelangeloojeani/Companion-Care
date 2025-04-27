import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup; // Declare the login form group to handle form validation

  constructor(
    private formBuilder: FormBuilder, // FormBuilder helps to create form controls
    private authService: AuthService, // AuthService for handling login functionality
    private router: Router, // Router for navigating between pages
    private loadingController: LoadingController, // For showing loading indicators during async operations
    private alertController: AlertController // To show alerts for errors or other notifications
  ) { }

  ngOnInit() {
    // Initialize the login form with email and password controls
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Email must be valid and required
      password: ['', [Validators.required]] // Password is required
    });
  }

   // Getter for email control to simplify access in the template
   get email() { return this.loginForm.get('email'); }

   // Getter for password control to simplify access in the template
   get password() { return this.loginForm.get('password'); }
 
   // Handles form submission when the user attempts to login
   async onSubmit() {
     if (this.loginForm.invalid) { // If the form is invalid, do nothing
       return;

         // Show loading indicator while logging in
    const loading = await this.loadingController.create({
      message: 'Logging in...'
    });
    await loading.present();
