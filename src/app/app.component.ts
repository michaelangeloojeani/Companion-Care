import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, IonicModule]
})
export class AppComponent {
  appPages = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home' },
    { title: 'Add Pet', url: '/add-pet', icon: 'add-circle' },
    { title: 'User Profile', url: '/user-profile', icon: 'person' },
  ];
  
  labels = ['Family', 'Friends', 'Veterinarians', 'Reminders'];
  
  constructor() {}
}