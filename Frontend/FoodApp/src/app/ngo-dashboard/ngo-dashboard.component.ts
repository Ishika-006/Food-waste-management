import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Donation, NgoDashboardService } from './service/ngo-dashboard.service';
interface Delivery {
  fid: number;
  name: string;
}
interface LocationDto {
  latitude: number;
  longitude: number;
}
@Component({
  selector: 'app-ngo-dashboard',
  templateUrl: './ngo-dashboard.component.html',
  styleUrls: ['./ngo-dashboard.component.css']
})
export class NgoDashboardComponent  implements OnInit{
  deliveries: Delivery[] = [];
  constructor(private router: Router ,private http: HttpClient,private dashboardService: NgoDashboardService) {}
  navigateToHome(): void {
    this.router.navigate(['/home']); // Navigate to donation form
  }

 

    donations: Donation[] = [];
    pendingCount = 0;
    acceptedCount = 0;
    totalToday = 0;
    peopleServed = 0;
  
  
  
    ngOnInit() {
      this.loadDonations();
      this.loadStats();
      const donorId = Number(localStorage.getItem('donorId')); // or wherever donorId is stored
      this.http.get<Delivery[]>(`http://localhost:8080/donor/deliveries`, { withCredentials: true })
      .subscribe({
        next: data => {
          this.deliveries = data ?? [];
          console.log('Deliveries:', this.deliveries);
          this.deliveries.forEach(d => {
            if (typeof d.fid !== 'number' || isNaN(d.fid)) {
              console.error("Invalid delivery ID detected:", d.fid);
            }
          });
        },
        error: err => {
          console.error('Failed to load deliveries', err);
          this.deliveries = [];
        }
      });    
    }
  
    loadDonations() {
      this.dashboardService.getMyDonations().subscribe(data => {
        this.donations = data;
        this.pendingCount = data.filter(d => d.status === 'PENDING').length;
        this.acceptedCount = data.filter(d => d.status === 'ACCEPTED').length;
        this.totalToday = data.length;
      });
    }
  
    loadStats() {
      this.dashboardService.getStats().subscribe(stats => {
        this.pendingCount = stats.pending;
        this.acceptedCount = stats.accepted;
        this.totalToday = stats.totalToday;
        this.peopleServed = stats.peopleServed;
      });
    }
    
  
    updateDonationStatus(id: number, status: string) {
      this.dashboardService.updateStatus(id, status).subscribe({
        next: () => this.loadDonations(),
        error: err => {
          alert('Error updating status: ' + err.error);
          console.error(err);
        }
      });
    }
    
  
    timeAgo(dateStr: string): string {
      const date = new Date(dateStr);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutes
      if (diff < 60) return `${diff} minutes ago`;
      const hours = Math.floor(diff / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
  logout() {
    this.http.post('https://backend-01-live-food.onrender.com/NGO/custom-logout', {}, {
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

  getDeliveryLocation(fid: number): void {
    this.http.get<LocationDto>(`https://backend-01-live-food.onrender.com/donor/deliveries/${fid}/location`, { withCredentials: true })
      .subscribe({
        next: location => {
          console.log("📍 Location:", location);
          // do something with the location
        },
        error: err => {
          console.error("❌ Failed to fetch location", err);
        }
      });
  }

  trackDelivery(fid: number) {
    localStorage.setItem('deliveryId', fid.toString());
    console.log('donorId from localStorage:', localStorage.getItem('donorId'));
    this.router.navigate(['/track']);
  }
  handleTrackClick() {
    if (this.deliveries && this.deliveries.length > 0) {
      const latestDelivery = this.deliveries[0];
      localStorage.setItem('deliveryId', latestDelivery.fid.toString());
  
      // ✅ Fetch location before navigating
      this.http.get<LocationDto>(`https://backend-01-live-food.onrender.com/donor/deliveries/${latestDelivery.fid}/location`, {
        withCredentials: true
      }).subscribe({
        next: location => {
          console.log("📍 Location:", location);
          
          // ✅ Save location in localStorage
          localStorage.setItem('deliveryLat', location.latitude.toString());
          localStorage.setItem('deliveryLng', location.longitude.toString());
  
          // ✅ Navigate to tracking page
          this.router.navigate(['/track']);
        },
        error: err => {
          console.error("❌ Failed to fetch location", err);
          alert("Could not fetch location for tracking.");
        }
      });
    } else {
      alert("❌ No delivery accepted yet!");
    }
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
