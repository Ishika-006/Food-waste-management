import { Component, OnInit } from '@angular/core';
import {DonordashboardService, FoodDonation } from './service/donordashboard.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Delivery {
  fid: number;
  name: string;
}
interface LocationDto {
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-donor-dashboard',
  templateUrl: './donor-dashboard.component.html',
  styleUrls: ['./donor-dashboard.component.css']
})
export class DonorDashboardComponent implements OnInit {
  deliveries: Delivery[] = [];
    totalDonations = 0;
    peopleHelped = 0;
    foodSaved = 0;
    thisMonth = 0;
    recentDonations: FoodDonation[] = [];
  
    constructor(private dashboardService: DonordashboardService,private http: HttpClient,private router: Router ) {}
  
    ngOnInit(): void {
      this.loadDashboardData();
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
    getDeliveryLocation(fid: number): void {
      this.http.get<LocationDto>(`http://localhost:8080/donor/deliveries/${fid}/location`, { withCredentials: true })
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
    
    loadDashboardData(): void {
      this.dashboardService.getTotalDonations().subscribe(data => {
        this.totalDonations = data;
      });
  
      this.dashboardService.getPeopleHelped().subscribe(data => {
        this.peopleHelped = data;
      });
  
      this.dashboardService.getFoodSaved().subscribe(data => {
        this.foodSaved = data;
      });
  
      this.dashboardService.getThisMonthDonations().subscribe(data => {
        this.thisMonth = data;
      });
  
      this.dashboardService.getRecentDonations().subscribe(data => {
        this.recentDonations = data;
      });
    }
    navigateToDonate(): void {
      this.router.navigate(['/donate']); // Navigate to donation form
    }
    navigateToSell(): void {
      this.router.navigate(['/sell']); // Navigate to donation form
    }
    navigateToHome(): void {
      this.router.navigate(['/home']); // Navigate to donation form
    }
    navigateToContri(): void {
      this.router.navigate(['/contribution']); // Navigate to donation form
    }
    navigateToFeedback(): void {
      this.router.navigate(['/feedback']); // Navigate to donation form
    }
    logout() {
      this.http.post('https://backend-01-live-food.onrender.com/donor/custom-logout', {}, {
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
