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