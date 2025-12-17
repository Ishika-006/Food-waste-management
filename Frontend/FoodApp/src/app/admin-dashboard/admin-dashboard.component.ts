import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdmindashboardService } from './service/admindashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {
    totalDonations: 0,
    foodSaved: 0,
    activeUsers: 0,
    donors: 0,
    ngos: 0,
    deliveryFleet: 0,
    availableDeliveryFleet: 0,
    busyDeliveryFleet: 0,
    pendingDonations: 0,
    acceptedDonations: 0,
    deliveredToday: 0
  };

  recentActivities: any[] = [];
  topDonors: any[] = [];

  constructor(
    private router: Router,
    private dashboardService: AdmindashboardService,private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchDashboardStats();
    this.fetchRecentActivities();
    this.fetchTopDonors();
    this.getDonations(); // <-- added
    this.loadDeliveryPersons();
  }

  fetchDashboardStats(): void {
    // Fetch total donations
    this.dashboardService.getTotalDonations().subscribe(
      (data) => this.stats.totalDonations = data,
      (err) => console.error('Error loading total donations', err)
    );

    // Fetch total food saved
    this.dashboardService.getTotalFoodSaved().subscribe(
      (data) => this.stats.foodSaved = data,
      (err) => console.error('Error loading food saved', err)
    );


    

    // Fetch active users
    this.dashboardService.getActiveUsers().subscribe(
      (data) => {
        this.stats.donors = data.donors;
        this.stats.ngos = data.ngos;
        this.stats.deliveryFleet = data.deliveryPersons;
        this.stats.activeUsers = data.total;
      },
      (err) => console.error('Error loading active users', err)
    );

    // Fetch donation status
    this.dashboardService.getDonationStatusCounts().subscribe(
      (data) => {
        this.stats.pendingDonations = data.pending;
        this.stats.acceptedDonations = data.accepted;
      },
      (err) => console.error('Error loading donation statuses', err)
    );

    this.dashboardService.getTotalDeliveries().subscribe(
      (data) => this.stats.deliveredToday = data.totalDeliveries,
      (err) => console.error('Error loading delivered today', err)
    );

    // Hardcoded/mock data – Replace with API if available
    this.stats.availableDeliveryFleet = 5;
    this.stats.busyDeliveryFleet = this.stats.deliveryFleet - this.stats.availableDeliveryFleet;
     // Replace this with a real API if available
  }

  
  fetchRecentActivities(): void {
    this.dashboardService.getRecentActivity().subscribe(
      (data) => {
        this.recentActivities = data;
      },
      (err) => {
        console.error('Error loading recent activities', err);
      }
    );
  }

  fetchTopDonors(): void {
    this.dashboardService.getTopDonorsThisMonth().subscribe(
      (data) => {
        this.topDonors = data;
      },
      (err) => {
        console.error('Error loading top donors', err);
      }
    );
  }

  logout(): void {
    this.http.post('https://backend-01-live-food.onrender.com/admin/custom-logout', {}, {
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

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  donations: any[] = [];
  donationColumns: string[] = ['fid', 'name', 'food', 'quantity', 'location', 'phoneno', 'status', 'date'];
  searchQuery: string = '';
  getDonations(): void {
    this.dashboardService.getDonations(this.searchQuery).subscribe({
      next: (data) => {
        this.donations = data;
      },
      error: (err) => {
        console.error('Error loading donations:', err);
      }
    });
  }
  openAddDonationDialog(): void {
    // TODO: Implement dialog open logic here
    alert('Add Donation dialog would open here.');
    this.router.navigate(['/donate']);
  }
  
  
  filterDonations(): void {
    this.getDonations();
  }
  
  exportDonations(): void {
    this.dashboardService.exportDonationsCSV().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'donations.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error exporting donations:', err);
      }
    });
  }
  deliveryPersons: any[] = [];
  searchDQuery: string = '';
  deliveryPersonColumns: string[] = ['id', 'name', 'phone', 'status'];

  loadDeliveryPersons(): void {
    this.dashboardService.getAllDeliveryPersons().subscribe({
      next: (data) => {
        this.deliveryPersons = data;
      },
      error: (err) => {
        console.error('Error fetching delivery persons:', err);
      }
    });
  }
  
  search(): void {
    const keyword = this.searchQuery.trim();
    if (keyword === '') {
      this.loadDeliveryPersons();
    } else {
      this.dashboardService.searchDeliveryPersons(keyword).subscribe({
        next: (data) => {
          this.deliveryPersons = data;
        },
        error: (err) => {
          console.error('Error searching delivery persons:', err);
        }
      });
    }
  }
  showAnalytics = false;
  downloadPDF() {
    this.dashboardService.downloadMonthlySummaryPDF().subscribe(blob => {
      this.triggerDownload(blob, 'Monthly_Summary.pdf');
    });
  }

  downloadExcel() {
    this.dashboardService.downloadNGOPerformanceExcel().subscribe(blob => {
      this.triggerDownload(blob, 'NGO_Performance.xlsx');
    });
  }

  downloadCSV() {
    this.dashboardService.downloadDeliveryEfficiencyCSV().subscribe(blob => {
      this.triggerDownload(blob, 'Delivery_Efficiency.csv');
    });
  }

  private triggerDownload(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
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
