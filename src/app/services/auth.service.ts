import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser = this.currentUserSubject.asObservable();


 // Constructor runs when the service is created
constructor(private http: HttpClient) {
  // Try to load the current user from localStorage if it exists
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
   
    this.currentUserSubject.next(JSON.parse(storedUser));
  }
}

// Login method
login(email: string, password: string): Observable<any> {
  // Send a POST request to the backend to log in
  return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
    .pipe(
      tap(response => {
        // If login is successful and a user object is returned
        if (response.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          // Update the current user in the app
          this.currentUserSubject.next(response.user);
        }
      })
    );
}

// Register method
register(user: User, password: string): Observable<any> {
  // Send a POST request to the backend to register a new user

  return this.http.post<any>(`${this.apiUrl}/auth/register`, { ...user, password });
}

// Logout method
logout(): void {
  // Clear user info and token from localStorage
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
  // Set current user to null in the app
  this.currentUserSubject.next(null);
}

// Get the currently logged-in user
getCurrentUser(): User | null {
  // Return the latest value of currentUserSubject (can be null if logged out)
  return this.currentUserSubject.value;
}

// Get the saved authentication token
getToken(): string | null {
  // Return the JWT token from localStorage
  return localStorage.getItem('token');
}
}
