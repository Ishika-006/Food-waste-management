import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_CONFIG } from 'src/app/config/api.config';


@Injectable({
  providedIn: 'root'
})
export class DonateService {

  private baseUrl = `${API_CONFIG.baseUrl}/donor`;

  constructor(private http: HttpClient) {}

  submitDonation(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/adddonate`,
      formData,
      {
        withCredentials: true,   // 🔥 SESSION COOKIE
        responseType: 'text'
      }
    );
  }
}