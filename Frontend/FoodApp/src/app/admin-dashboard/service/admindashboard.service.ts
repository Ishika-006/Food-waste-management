import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from 'src/app/config/api.config';



@Injectable({
  providedIn: 'root'
})
export class AdmindashboardService {

  private baseUrl = `${API_CONFIG.baseUrl}/admin`; // Backend base path

  constructor(private http: HttpClient) {}
  getTotalDonations(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-donations`,{ withCredentials: true });
  }

  getActiveUsers(): Observable<{
    donors: number,
    ngos: number,
    deliveryPersons: number,
    total: number
  }> {
    return this.http.get<{
      donors: number,
      ngos: number,
      deliveryPersons: number,
      total: number
    }>(`${this.baseUrl}/active-users`,{ withCredentials: true });
  }


  getDonationStatusCounts(): Observable<{ pending: number, accepted: number }> {
    return this.http.get<{ pending: number, accepted: number }>(`${this.baseUrl}/donation-status-counts`,{ withCredentials: true });
  }

  getTotalFoodSaved(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/food-saved`,{ withCredentials: true });
  }

  logout(): Observable<string> {
    return this.http.post('http://localhost:8080/admin/custom-logout', {}, {
      withCredentials: true,
      responseType: 'text'
    });
  }

  getTotalDeliveries(): Observable<{ totalDeliveries: number }> {
    return this.http.get<{ totalDeliveries: number }>(
      `${this.baseUrl}/delivery-summary`,
      { withCredentials: true }
    );
  }

  getRecentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recent-activity`, { withCredentials: true });
  }
  
  getTopDonorsThisMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/top-donors`, { withCredentials: true });
  }
  
    // ✅ Fetch all donations or search donations
    getDonations(search?: string): Observable<any[]> {
      let params = new HttpParams();
      if (search && search.trim() !== '') {
        params = params.set('search', search);
      }
      return this.http.get<any[]>(`${this.baseUrl}/getAll`, { params, withCredentials: true });
    }
    
  
    // ✅ Export CSV
    exportDonationsCSV(): Observable<Blob> {
      return this.http.get(`${this.baseUrl}/export`, {
        responseType: 'blob',
        withCredentials: true 
      });
    }

    getAllDeliveryPersons() {
      return this.http.get<any[]>(`${this.baseUrl}/getAllDeliveryPersons`, { withCredentials: true });
    }
  
    searchDeliveryPersons(keyword: string) {
      return this.http.get<any[]>(`${this.baseUrl}/search?keyword=${keyword}`, { withCredentials: true });
    }

    downloadMonthlySummaryPDF() {
      return this.http.get(`${this.baseUrl}/monthly-summary`, { responseType: 'blob',  withCredentials: true  });
    }
  
    downloadNGOPerformanceExcel() {
      return this.http.get(`${this.baseUrl}/ngo-performance`, { responseType: 'blob',  withCredentials: true });
    }
  
    downloadDeliveryEfficiencyCSV() {
      return this.http.get(`${this.baseUrl}/delivery-efficiency`, { responseType: 'blob',  withCredentials: true });
    }

    getMonthlyDonations(): Observable<any> {
      return this.http.get(`${this.baseUrl}/monthly`, { withCredentials: true });
    }
  
    getStatusDistribution(): Observable<any> {
      return this.http.get(`${this.baseUrl}/status-distribution`, { withCredentials: true });
    }
  
    getTopDonors(): Observable<any> {
      return this.http.get(`${this.baseUrl}/top-donor`, { withCredentials: true });
    }
  
    getNGODistribution(): Observable<any> {
      return this.http.get(`${this.baseUrl}/ngo-distribution`, { withCredentials: true });
    }
}
