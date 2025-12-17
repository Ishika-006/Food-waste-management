import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SellService } from '../../service/sell.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  sellForm!: FormGroup;
  selectedImage: File | null = null;
  predictionResult: string | null = null;
  loadingPrediction = false;

  constructor(
    private fb: FormBuilder,
    private sellService: SellService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.sellForm = this.fb.group({
      name: [''],
      email: [''],
      phoneno: [''],
      food: [''],
      type: [''],
      category: [''],
      quantity: [''],
      price: [''],
      address: [''],
      location: [''],
      date: [this.getBackendCompatibleDate()]
    });
  }

  getBackendCompatibleDate(): string {
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
    formData.append('file', file);

    const apiUrl =
      'https://detect.roboflow.com/donate-jslwt/2?api_key=j0FrsE52GpFxipdX1Rmc';

    this.http.post(apiUrl, formData).subscribe({
      next: (res: any) => {
        this.predictionResult = res.predictions?.[0]?.class || 'Unknown';
        this.loadingPrediction = false;
      },
      error: () => {
        this.predictionResult = 'Error';
        this.loadingPrediction = false;
      }
    });
  }

  submitSell() {
    if (this.predictionResult?.toLowerCase() !== 'fresh') {
      alert('Your food is not fresh. You cannot sell this item.');
      return;
    }

    if (!this.selectedImage) {
      alert('Please upload image');
      return;
    }

    const formData = new FormData();

    Object.entries(this.sellForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value as any);
      }
    });

    formData.append('image', this.selectedImage);

    this.sellService.submitSell(formData).subscribe({
      next: () => {
        alert('Food item listed for sale successfully!');
        this.sellForm.reset({
          date: this.getBackendCompatibleDate()
        });
        this.selectedImage = null;
        this.predictionResult = null;
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          alert('You must be logged in to sell.');
        } else {
          alert('Something went wrong!');
        }
      }
    });
  }
}
