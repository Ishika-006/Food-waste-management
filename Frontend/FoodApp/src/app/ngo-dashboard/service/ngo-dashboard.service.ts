import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api.config';

export interface Donation {
  fid: number;
  name: string;
  email: string;
  food: string;
  type: string;
  category: string;
  quantity: string;
  date: string;  // or Date
  address: string;
  location: string;
  phoneno: string;
  price?: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

@Injectable({
  providedIn: 'root'
})
export class NgoDashboardService {

  private baseUrl = `${API_CONFIG.baseUrl}/NGO`;

  constructor(private http: HttpClient) {}

  getMyDonations() {
    return this.http.get<Donation[]>(`${this.baseUrl}/my-donations`, { withCredentials: true });
  }

  updateStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/${id}/status?status=${status}`, {}, {
      withCredentials: true,
      responseType: 'text'  // ✅ tell Angular to expect plain text
    });
  }
  
  getStats() {
    return this.http.get<any>(`${this.baseUrl}/stats`, { withCredentials: true });
  }
}
