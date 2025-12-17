// donate.component.ts
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DonateService } from '../../service/donate.service';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.css']
})
export class DonateComponent {
  donationForm!: FormGroup;
  selectedImage: File | null = null;
  predictionResult: string | null = null; // ✅ To store stale/fresh result
  loadingPrediction = false;

  constructor(
    private fb: FormBuilder,
    private donationService: DonateService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.donationForm = this.fb.group({
      name: [''],
      email: [''],
      phoneno: [''],
      food: [''],
      type: [''],
      category: [''],
      quantity: [''],
      address: [''],
      location: [''],
      date: [this.getBackendCompatibleDate()]
    });
  }

  getBackendCompatibleDate(): string {
    // const d = new Date();
    // const pad = (n: number) => n.toString().padStart(2, '0');

    // return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T` +
    //        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}+05:30`;

    return '2025-01-15T10:30:00+05:30';
  }


  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      this.getPrediction(this.selectedImage);
    }
  }

  getPrediction(file: File) {
    this.loadingPrediction = true;
    this.predictionResult = null;

    const formData = new FormData();
    formData.append("file", file);

    // ✅ Replace URL with your actual model endpoint
    const apiUrl = `https://detect.roboflow.com/donate-jslwt/2?api_key=j0FrsE52GpFxipdX1Rmc`;

    this.http.post(apiUrl, formData).subscribe({
      next: (res: any) => {
        console.log("Prediction:", res);
        // Adjust based on your API’s response format
        this.predictionResult = res.predictions?.[0]?.class || 'Unknown';
        this.loadingPrediction = false;
      },
      error: (err) => {
        console.error("Prediction error", err);
        this.predictionResult = "Error getting prediction";
        this.loadingPrediction = false;
      }
    });
  }

  submitDonation() {
    if (this.predictionResult?.toLowerCase() !== 'fresh') {
      alert('Your food is not fresh. Donation cannot be accepted.');
      return;
    }
  
    if (!this.selectedImage) {
      alert('Please upload image');
      return;
    }
  
    const formData = new FormData();
  
    Object.entries(this.donationForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });
  
    // ✅ SAFE NOW
    formData.append('image', this.selectedImage);
  
    this.donationService.submitDonation(formData).subscribe({
      next: () => {
        alert('Thanks for donating!');
        this.donationForm.reset({
          date: this.getBackendCompatibleDate()
        });
        this.selectedImage = null;
        this.predictionResult = null;
      },
      error: () => {
        alert('Something went wrong!');
      }
    });
  }
}  