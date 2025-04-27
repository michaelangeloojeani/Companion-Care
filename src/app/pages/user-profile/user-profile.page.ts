import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PetService } from '../../services/pet.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class UserProfilePage implements OnInit {
  user: User;
  petsCount: number = 0;

  constructor(
    private authService: AuthService,
    private petService: PetService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loadUserProfile();
    this.countPets();
  }

  loadUserProfile() {
    this.user = this.authService.getCurrentUser();
  }

  countPets() {
    this.petService.getAllPets().subscribe(
      (pets) => {
        this.petsCount = pets.length;
      },
      (error) => {
        console.error('Error counting pets', error);
      }
    );
  }

  async editProfile() {
    const alert = await this.alertController.create({
      header: 'Edit Profile',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: this.user.name
        },
        {
          name: 'gender',
          type: 'text',
          placeholder: 'Gender',
          value: this.user.gender
        },
        {
          name: 'country',
          type: 'text',
          placeholder: 'Country',
          value: this.user.country
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            const loading = await this.loadingController.create({
              message: 'Updating profile...'
            });
            await loading.present();

            const updatedUser = { ...this.user, ...data };
            
            // This is a placeholder - you would need to implement updateUser in your AuthService
            // this.authService.updateUser(updatedUser).subscribe(
            //   async (user) => {
            //     this.user = user;
            //     loading.dismiss();
            //     this.presentToast('Profile updated successfully');
            //   },
            //   async (error) => {
            //     console.error('Error updating profile', error);
            //     loading.dismiss();
            //     this.presentToast('Error updating profile', 'danger');
            //   }
            // );

            // For now, just update locally since we don't have the full backend implementation
            this.user = updatedUser;
            loading.dismiss();
            this.presentToast('Profile updated successfully');
          }
        }
      ]
    });
    await alert.present();
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Change Password',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Current Password',
          required: true
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'New Password',
          required: true
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirm New Password',
          required: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Change Password',
          handler: async (data) => {
            if (data.newPassword !== data.confirmPassword) {
              this.presentToast('New passwords do not match', 'danger');
              return false;
            }

            const loading = await this.loadingController.create({
              message: 'Changing password...'
            });
            await loading.present();

            // This is a placeholder - you would need to implement changePassword in your AuthService
            // this.authService.changePassword(data.currentPassword, data.newPassword).subscribe(
            //   async () => {
            //     loading.dismiss();
            //     this.presentToast('Password changed successfully');
            //   },
            //   async (error) => {
            //     console.error('Error changing password', error);
            //     loading.dismiss();
            //     this.presentToast('Error changing password: ' + error.message, 'danger');
            //   }
            // );

            // For now, just show a success message
            loading.dismiss();
            this.presentToast('Password changed successfully');
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color
    });
    await toast.present();
  }
}