import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ActionSheetController, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { ReminderService } from '../../services/reminder.service';
import { Pet } from '../../models/pet.model';
import { Reminder } from '../../models/reminder.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-pet-profile',
  templateUrl: './pet-profile.page.html',
  styleUrls: ['./pet-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PetProfilePage implements OnInit {
  petId: string;
  pet: Pet;
  reminders: Reminder[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private reminderService: ReminderService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.petId = this.route.snapshot.paramMap.get('id');
    this.loadPet();
    this.loadReminders();
  }

  loadPet() {
    this.petService.getPet(this.petId).subscribe(
      (pet: Pet) => {
        this.pet = pet;
      },
      error => {
        console.error('Error loading pet', error);
      }
    );
  }

  loadReminders() {
    this.reminderService.getPetReminders(this.petId).subscribe(
      (reminders: Reminder[]) => {
        this.reminders = reminders.sort((a, b) => 
          new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
        );
      },
      error => {
        console.error('Error loading reminders', error);
      }
    );
  }

  async updatePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      const loading = await this.loadingController.create({
        message: 'Updating photo...'
      });
      await loading.present();

      // Convert data URL to Blob
      const response = await fetch(image.dataUrl);
      const blob = await response.blob();

      this.petService.updatePet(this.petId, this.pet, blob).subscribe(
        async (updatedPet) => {
          this.pet = updatedPet;
          loading.dismiss();
          
          const toast = await this.toastController.create({
            message: 'Photo updated successfully',
            duration: 2000,
            color: 'success'
          });
          await toast.present();
        },
        async (error) => {
          loading.dismiss();
          console.error('Error updating photo', error);
          
          const toast = await this.toastController.create({
            message: 'Error updating photo',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
        }
      );
    } catch (error) {
      console.error('Error taking photo', error);
    }
  }

  async showActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Edit Pet Info',
          icon: 'create-outline',
          handler: () => {
            this.editPet();
          }
        },
        {
          text: 'Delete Pet',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => {
            this.deletePet();
          }
        },
        {
          text: 'Cancel',
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async editPet() {
    // Navigate to edit page or show edit form
    // This is a placeholder - you would create an edit page or modal
    const alert = await this.alertController.create({
      header: 'Edit Pet',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name',
          value: this.pet.name
        },
        {
          name: 'species',
          type: 'text',
          placeholder: 'Species',
          value: this.pet.species
        },
        {
          name: 'breed',
          type: 'text',
          placeholder: 'Breed',
          value: this.pet.breed
        },
        {
          name: 'weight',
          type: 'number',
          placeholder: 'Weight (kg)',
          value: this.pet.weight
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: (data) => {
            const updatedPet = { ...this.pet, ...data };
            this.petService.updatePet(this.petId, updatedPet).subscribe(
              (pet) => {
                this.pet = pet;
                this.presentToast('Pet updated successfully');
              },
              (error) => {
                console.error('Error updating pet', error);
                this.presentToast('Error updating pet', 'danger');
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  async deletePet() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete ${this.pet.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Deleting...'
            });
            await loading.present();

            this.petService.deletePet(this.petId).subscribe(
              async () => {
                loading.dismiss();
                await this.presentToast('Pet deleted successfully');
                this.router.navigateByUrl('/dashboard');
              },
              async (error) => {
                loading.dismiss();
                console.error('Error deleting pet', error);
                await this.presentToast('Error deleting pet', 'danger');
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  async addReminder() {
    const alert = await this.alertController.create({
      header: 'Add Reminder',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title',
          required: true
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description (optional)'
        },
        {
          name: 'type',
          type: 'select',
          placeholder: 'Reminder Type',
          options: [
            { text: 'Medication', value: 'medication' },
            { text: 'Vet Visit', value: 'vet' },
            { text: 'Grooming', value: 'grooming' },
            { text: 'Other', value: 'other' }
          ]
        },
        {
          name: 'dateTime',
          type: 'datetime-local',
          placeholder: 'Date and Time'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            const reminder: Reminder = {
              petId: this.petId,
              title: data.title,
              description: data.description,
              type: data.type,
              dateTime: new Date(data.dateTime),
              isComplete: false
            };

            this.reminderService.addReminder(reminder).subscribe(
              (newReminder) => {
                this.reminders.push(newReminder);
                this.reminders.sort((a, b) => 
                  new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
                );
                this.presentToast('Reminder added successfully');
              },
              (error) => {
                console.error('Error adding reminder', error);
                this.presentToast('Error adding reminder', 'danger');
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }

  toggleReminder(reminder: Reminder) {
    reminder.isComplete = !reminder.isComplete;
    this.reminderService.updateReminder(reminder.id, { isComplete: reminder.isComplete }).subscribe(
      () => {
        // Successfully updated
      },
      (error) => {
        console.error('Error updating reminder', error);
        reminder.isComplete = !reminder.isComplete; // Revert change
        this.presentToast('Error updating reminder', 'danger');
      }
    );
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