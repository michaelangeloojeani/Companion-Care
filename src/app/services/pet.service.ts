// This service handles all API operations related to pets

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root' // Makes the service available throughout the app
})
export class PetService {
  private apiUrl = 'http://localhost:3000/api/pets'; // Base URL for pets API

  constructor(
    private http: HttpClient,        // Inject HttpClient to make HTTP requests
    private authService: AuthService // Inject AuthService to get the auth token
  ) { }

  // Helper method to set Authorization headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken(); // Get token from AuthService
    return new HttpHeaders().set('Authorization', `Bearer ${token}`); // Attach token to headers
  }

  // Get all pets from the backend
  getAllPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Get a specific pet by ID
  getPet(id: string): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Add a new pet (optionally with a photo)
  addPet(pet: Pet, photo?: File): Observable<Pet> {
    const formData = new FormData();
    
    // Add each pet property to the formData
    Object.keys(pet).forEach(key => {
      formData.append(key, (pet as any)[key]);

    });
    
    // If a photo is provided, add it to the formData
    if (photo) {
      formData.append('photo', photo);
    }
    
    // Send POST request to create the pet
    return this.http.post<Pet>(this.apiUrl, formData, { headers: this.getHeaders() });
  }

  // Update an existing pet (optionally with a new photo)
  updatePet(id: string, pet: Pet, photo?: File): Observable<Pet> {
    const formData = new FormData();
    
    // Add updated pet properties to the formData
    Object.keys(pet).forEach(key => {
      formData.append(key, (pet as any)[key]);

    });
    
    // If a new photo is provided, add it to the formData
    if (photo) {
      formData.append('photo', photo);
    }
    
    // Send PUT request to update the pet
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, formData, { headers: this.getHeaders() });
  }

  // Delete a pet by ID
  deletePet(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
