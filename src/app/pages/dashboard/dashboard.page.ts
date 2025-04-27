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

         // For each pet, get upcoming reminder
         this.pets.forEach(pet => {
          this.reminderService.getPetReminders(pet.id).subscribe(
            reminders => {
              const upcomingReminders = reminders
                .filter(r => !r.isComplete && new Date(r.dateTime) > new Date())
                .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
              
              if (upcomingReminders.length > 0) {
                const nextReminder = upcomingReminders[0];
                const reminderDate = new Date(nextReminder.dateTime);
                pet.upcomingReminder = `${nextReminder.title} ${this.formatReminderDate(reminderDate)}`;
              }
            }
          );
        });
      },
      error => {
        console.error('Error loading pets', error);
      }
    );
  }