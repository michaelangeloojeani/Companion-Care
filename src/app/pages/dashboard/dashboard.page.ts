import { Component, OnInit } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, UpperCasePipe]
})
export class DashboardPage implements OnInit {
  pets: any[] = [];
  
  constructor(
    private petService: PetService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getAllPets().subscribe(
      (pets) => {
        this.pets = pets;
      },
      error => {
        console.error('Error loading pets', error);
      }
    );
  }

  goToPetProfile(petId: string) {
    this.router.navigate(['/pet-profile', petId]);
  }

  goToAddPet() {
    this.router.navigate(['/add-pet']);
  }
}