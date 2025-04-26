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