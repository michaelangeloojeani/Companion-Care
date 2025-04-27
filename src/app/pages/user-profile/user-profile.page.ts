import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class UserProfilePage implements OnInit {
  user!: User;
  petsCount: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    } else {
      // Handle case where no user is logged in
      this.router.navigate(['/login']);
    }
  }

  // Fix the alertController methods by removing 'required' property
  editProfile() {
    console.log('Would edit profile here');
    // Replace alert inputs with:
    // {
    //   name: 'currentPassword',
    //   type: 'password',
    //   placeholder: 'Current Password'
    // },
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Fix the handler method to ensure all paths return a value
  exampleHandler(data: any) {
    // Process data
    return true; // Return a value for all paths
  }
}