import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api.config';


@Injectable({
  providedIn: 'root'
})
export class DonorService {
  private baseUrl = `${API_CONFIG.baseUrl}/donor`; // Spring Boot backend URL

  constructor(private http: HttpClient) {}

  // Login donor using email and password as query params
  loginDonor(email: string, password: string) {
    return this.http.post(
      `${this.baseUrl}/login`,
      { email, password },
      { withCredentials: true }
    );
  }
  
  registerDonor(donorData: any) {
    return this.http.post(`${this.baseUrl}/register`, donorData, {
      withCredentials: true   // ✅ safe to keep true
    });
  }

  verifyEmail(email: string) {
    return this.http.get(`${this.baseUrl}/verify-email?email=${email}`, {
      withCredentials: true
    });
  }
  
  updatePassword(email: string, newPassword: string) {
    return this.http.put(
      `${this.baseUrl}/update-password`,
      { email, newPassword },
      { withCredentials: true }
    );
}
}