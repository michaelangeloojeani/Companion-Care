import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-add-pet',
  templateUrl: './add-pet.page.html',
  styleUrls: ['./add-pet.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule]
})
export class AddPetPage implements OnInit {
  petForm!: FormGroup; // Form group to manage pet form inputs
  previewUrl: string | null = null;
  selectedImage: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private petService: PetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.petForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      species: ['', [Validators.required]],
      breed: [''],
      gender: [''],
      dob: [''],
      weight: ['']
    });
  }

  selectImage() {
    // For now, just a placeholder since we need to add @capacitor/camera
    console.log('Image selection would happen here');
    // When properly implemented, this would use the Camera API
  }

  onSubmit() {
    if (this.petForm.invalid) {
      return;
    }

    const pet = this.petForm.value;
    
    // Converting null to undefined to match the expected type
    const imageFile = this.selectedImage || undefined;
    
    this.petService.addPet(pet, imageFile).subscribe(
      (response) => {
        console.log('Pet added successfully:', response);
        this.router.navigateByUrl('/dashboard');
      },
      (error) => {
        console.error('Error adding pet:', error);
      }
    );
  }
}