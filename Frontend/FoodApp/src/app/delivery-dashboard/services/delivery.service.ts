import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from 'src/app/config/api.config';


@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  private baseUrl = `${API_CONFIG.baseUrl}/delivery`; // Backend base path

  constructor(private http: HttpClient) {}
  getUnassignedOrders() {
    return this.http.get(`${this.baseUrl}/unassigned`, { withCredentials: true });
  }
  
  

  getMyOrders() {
    return this.http.get(`${this.baseUrl}/myorders`,{ withCredentials: true });
  }

  takeOrder(orderId: number) {
    return this.http.post(`${this.baseUrl}/takeorder?orderId=${orderId}`, null, { withCredentials: true });
  }

  getDeliverySummary(deliveryPersonId: number) {
    return this.http.get(`${this.baseUrl}/summary`, { withCredentials: true });
  }
  
}  
