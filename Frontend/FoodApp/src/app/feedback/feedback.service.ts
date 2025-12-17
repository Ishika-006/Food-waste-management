import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';


export interface UserFeedback {
  name: string;
  email: string;
  message: string;
  userType: string;
  overallExperience: number;
  aiFreshness: string;
  detailedFeedback?: string;
  suggestions?: string;
}


@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private baseUrl = `${API_CONFIG.baseUrl}/feedbacks`;  // Backend URL

  constructor(private http: HttpClient) { }

  submitFeedback(feedback: UserFeedback): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, feedback, { responseType: 'text' });
  }

  getAllFeedbacks(): Observable<UserFeedback[]> {
    return this.http.get<UserFeedback[]>(`${this.baseUrl}/all`);
  }

  getFeedbackCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }

  deleteFeedback(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteById/${id}`);
  }
}
