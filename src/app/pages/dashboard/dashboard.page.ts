import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { ReminderService } from '../../services/reminder.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  pets: any[] = [];
  
  constructor(
    private petService: PetService,
    private reminderService: ReminderService,
    private router: Router
  ) { }

  ngOnInit() {
    // Nothing here - we'll load in ionViewWillEnter
  }

  ionViewWillEnter() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getAllPets().subscribe(
      (pets: Pet[]) => {
        this.pets = pets;