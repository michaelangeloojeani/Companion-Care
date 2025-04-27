import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { ReminderService } from '../../services/reminder.service';
import { Pet } from '../../models/pet.model';
import { Reminder } from '../../models/reminder.model';

@Component({
  selector: 'app-pet-profile',
  templateUrl: './pet-profile.page.html',
  styleUrls: ['./pet-profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PetProfilePage implements OnInit {
  petId: string = '';
  pet!: Pet;
  reminders: Reminder[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private reminderService: ReminderService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petId = id;
      this.loadPet();
      this.loadReminders();
    } else {
      // Handle invalid pet ID
      this.router.navigate(['/dashboard']);
    }
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

  // Other methods simplified for now to fix type errors
  updatePhoto() {
    // Placeholder for now
    console.log('Would update photo here');
  }

  showActionSheet() {
    // Placeholder
    console.log('Would show action sheet here');
  }

  editPet() {
    // Placeholder
    console.log('Would edit pet here');
  }

  deletePet() {
    // Placeholder
    console.log('Would delete pet here');
  }

  addReminder() {
    // Placeholder
    console.log('Would add reminder here');
  }

  toggleReminder(reminder: Reminder) {
    if (reminder.id) {
      reminder.isComplete = !reminder.isComplete;
      this.reminderService.updateReminder(reminder.id, { isComplete: reminder.isComplete }).subscribe(
        () => {
          // Successfully updated
        },
        (error) => {
          console.error('Error updating reminder', error);
          reminder.isComplete = !reminder.isComplete; // Revert change
        }
      );
    }
  }
}