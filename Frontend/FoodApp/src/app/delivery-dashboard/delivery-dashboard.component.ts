import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryService } from './services/delivery.service';
interface DeliveryRequest {
  fid: number;

  ngoName: string;
  ngoAddress: string;
  ngoCity: string;

  donorName: string;
  donorAddress: string;
  donorCity: string;

  food: string;
  type: string;
  category: string;
  quantity: string;

  distance: number;
  estimatedTime: string;
}

@Component({
  selector: 'app-delivery-dashboard',
  templateUrl: './delivery-dashboard.component.html',
  styleUrls: ['./delivery-dashboard.component.css']
})
export class DeliveryDashboardComponent {
  constructor(private router: Router ,private http: HttpClient,private deliveryService: DeliveryService) {}
  navigateToHome(): void {
    this.router.navigate(['/home']); // Navigate to donation form
  }
  


  totalDeliveries = 0;
  weeklyDeliveries = 0;
  rating = 0;
  onTimeRate = 0;
  newRequests: DeliveryRequest[] = [];
  activeDeliveries: any[] = [];


  ngOnInit(): void {
    this.fetchDashboardData();
    this.fetchUnassignedOrders();
    this.fetchMyOrders();
  }

  fetchDashboardData(): void {
    const deliveryPersonId = 1; // Replace with dynamic ID if you're getting it from login/session
  
    this.deliveryService.getDeliverySummary(deliveryPersonId).subscribe({
      next: (data: any) => {
        this.totalDeliveries = data.totalDeliveries || 0;
        this.weeklyDeliveries = data.weeklyDeliveries || 0;
        
        // You can later set these from backend too if needed
        this.rating = 4.8;
        this.onTimeRate = 96;
      },
      error: err => {
        console.error('Failed to fetch delivery summary', err);
        // Optionally show a toast or default values
        this.totalDeliveries = 0;
        this.weeklyDeliveries = 0;
      }
    });
  }
  

  fetchUnassignedOrders(): void {
    this.deliveryService.getUnassignedOrders().subscribe((res: any) => {
      this.newRequests = res;
    });
  }

  fetchMyOrders(): void {
    this.deliveryService.getMyOrders().subscribe((res: any) => {
      this.activeDeliveries = res;
    });
  }

  acceptOrder(orderId: number): void {
    this.deliveryService.takeOrder(orderId).subscribe({
      next: () => {
        this.fetchUnassignedOrders();
        this.fetchMyOrders();
      },
      error: err => {
        alert('Failed to accept order: ' + err.error);
      }
    });
  }

  logout() {
    this.http.post('https://backend-01-live-food.onrender.com/delivery/custom-logout', {}, {
      withCredentials: true, // To include session cookies
      responseType: 'text'   // To properly handle plain text response
    }).subscribe({
      next: (response) => {
        alert(response); // Show success message
        this.router.navigate(['/home']); // Navigate to login or home page
      },
      error: (err) => {
        alert('Logout failed: ' + err.error);
      }
    });
  }
  navigateToFeedback(): void {
    this.router.navigate(['/feedback']); // Navigate to donation form
  }
  navigateToAbout(): void {
    this.router.navigate(['/about-us']);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact-us']);
  }

  navigateToWork(): void {
    this.router.navigate(['/how-work']);
  }
}
