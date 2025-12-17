import { NgModule } from "@angular/core";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { MatOptionModule } from "@angular/material/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { DonorDashboardComponent } from "./donor-dashboard.component";
import { MatListModule } from '@angular/material/list';
import { DonateComponent } from './components/donate/donate.component';
import { SellComponent } from './components/sell/sell.component';
import { DonorDashboardRoutingModule } from "./donor-dashboard-rounting.module";
import { ContributionComponent } from "./components/contribution/contribution.component";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from "@angular/material/select";


@NgModule({
  declarations: [
   DonorDashboardComponent,
   DonateComponent,
   SellComponent,
   ContributionComponent
  ],
  imports: [
    CommonModule,  
    MatInputModule,
    MatFormFieldModule,
    DonorDashboardRoutingModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatOptionModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatSelectModule
    
  ]
})
export class DonordashboardModule { }