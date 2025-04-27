import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ActionSheetController } from '@ionic/angular';
import { PetService } from '../../services/pet.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
  standalone: true,
})
export class AddPetPage implements OnInit {
  petForm: FormGroup; // Form group to manage pet form inputs
  previewUrl: string | null = null; // To show image preview before submitting
  selectedImage: Blob | null = null; // Holds the selected or taken image as a Blob

  constructor(
    private formBuilder: FormBuilder,
    private petService: PetService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    // Initialize the pet form with form controls and validators
    this.petForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      species: ['', [Validators.required]],
      breed: [''],
      gender: [''],
      dob: [''],
      weight: ['']
    });
  }

  // Opens an action sheet for the user to select an image source
  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Take Photo',
          handler: () => {
            this.takePicture(CameraSource.Camera);
          }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            this.takePicture(CameraSource.Photos);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

   // Launches the camera or photo library to capture/select an image
   async takePicture(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl, // Get image as a base64 data URL
        source
      });

      this.previewUrl = image.dataUrl; // Set preview for UI

      // Convert the base64 image to a Blob object
      const response = await fetch(image.dataUrl);
      this.selectedImage = await response.blob();
    } catch (error) {
      console.error('Error taking photo', error);
    }
  }

  // Submits the form to add a new pet
  async onSubmit() {
    if (this.petForm.invalid) {
      return; // Stop if form is invalid
    }

    const loading = await this.loadingController.create({
      message: 'Saving pet...'
    });
    await loading.present();

    const pet = this.petForm.value;

    // Call the service to add the pet, passing pet details and optional image
    this.petService.addPet(pet, this.selectedImage).subscribe(
      async (response) => {
        loading.dismiss();

        // Show success message
        const toast = await this.toastController.create({
          message: 'Pet added successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.router.navigateByUrl('/dashboard'); // Navigate to dashboard
      },
      async (error) => {
        loading.dismiss();

        // Show error message
        const toast = await this.toastController.create({
          message: 'Error adding pet. Please try again.',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();

        console.error('Error adding pet', error);
      }
    );
  }
}