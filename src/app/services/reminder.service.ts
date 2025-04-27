import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reminder } from '../models/reminder.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private apiUrl = 'http://localhost:3000/api/reminders';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getAllReminders(): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPetReminders(petId: string): Observable<Reminder[]> {
    return this.http.get<Reminder[]>(`${this.apiUrl}/pet/${petId}`, { headers: this.getHeaders() });
  }

  addReminder(reminder: Reminder): Observable<Reminder> {
    return this.http.post<Reminder>(this.apiUrl, reminder, { headers: this.getHeaders() });
  }

  updateReminder(id: string, reminder: Partial<Reminder>): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, reminder, { headers: this.getHeaders() });
  }

  deleteReminder(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  markComplete(id: string, isComplete: boolean): Observable<Reminder> {
    return this.http.put<Reminder>(`${this.apiUrl}/${id}`, { isComplete }, { headers: this.getHeaders() });
  }
}