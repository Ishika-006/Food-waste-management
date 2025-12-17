import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/app/config/api.config';

@Injectable({
  providedIn: 'root'
})
export class SellService {

  private baseUrl = `${API_CONFIG.baseUrl}/donor`;

  constructor(private http: HttpClient) {}

  submitSell(formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/addSell`,
      formData,
      {
        withCredentials: true,
        responseType: 'text'
      }
    );
  }
}
