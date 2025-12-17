import { Component } from '@angular/core';
import { DeliveryService } from '../../service/delivery.service';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-delivery-login',
  templateUrl: './delivery-login.component.html',
  styleUrls: ['./delivery-login.component.css']
})
export class DeliveryLoginComponent {
  isLoginMode = true;
  isForgotPasswordMode = false;
  emailVerified = false;
  EMAILJS_SERVICE_ID = 'service_8r4zy1v';   
  EMAILJS_TEMPLATE_ID = 'template_hbxdgbj'; 
  EMAILJS_PUBLIC_KEY = 'yBmE_EU9lg-NEnYb3';   


  // Individual field error messages
  fieldErrors: any = {
    name: '',
    email: '',
    password: '',
    city: '',
    loginEmail: '',
    loginPassword: '',
    forgotEmail: '',
    newPassword: ''
  };

  errorMessage = '';

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    city: '',
    role: 'DELIVERY'
  };

  forgotEmail = '';
  newPassword = '';

  constructor(private deliveryService: DeliveryService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.clearErrors();
  }

  showForgotPassword() {
    this.isForgotPasswordMode = true;
    this.clearErrors();
    this.emailVerified = false;
    this.forgotEmail = '';
    this.newPassword = '';
  }

  cancelForgotPassword() {
    this.isForgotPasswordMode = false;
    this.clearErrors();
    this.emailVerified = false;
    this.forgotEmail = '';
    this.newPassword = '';
  }

  clearErrors() {
    for (let key in this.fieldErrors) {
      this.fieldErrors[key] = '';
    }
  }

  /** -------------------
   * VALIDATION METHODS
   * ------------------- */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  }

  /** -------------------
   * REAL-TIME VALIDATION
   * ------------------- */
  onRegisterChange(field: string) {
    const value = (this.registerData as any)[field];
    switch (field) {
      case 'name':
        this.fieldErrors.name = value ? '' : 'Name is required';
        break;
      case 'email':
        if (!value) this.fieldErrors.email = 'Email is required';
        else if (!this.validateEmail(value)) this.fieldErrors.email = 'Invalid email format';
        else this.fieldErrors.email = '';
        break;
      case 'password':
        if (!value) this.fieldErrors.password = 'Password is required';
        else if (!this.validatePassword(value)) this.fieldErrors.password = 'Password must be alphanumeric and at least 6 characters';
        else this.fieldErrors.password = '';
        break;
      case 'city':
        this.fieldErrors.city = value ? '' : 'City is required';
        break;
    }
  }

  onLoginChange(field: string) {
    const value = (this.loginData as any)[field];
    switch (field) {
      case 'email':
        if (!value) this.fieldErrors.loginEmail = 'Email is required';
        else if (!this.validateEmail(value)) this.fieldErrors.loginEmail = 'Invalid email format';
        else this.fieldErrors.loginEmail = '';
        break;
      case 'password':
        this.fieldErrors.loginPassword = value ? '' : 'Password is required';
        break;
    }
  }

  onForgotChange(field: string) {
    const value = (field === 'forgotEmail') ? this.forgotEmail : this.newPassword;
    if (field === 'forgotEmail') {
      if (!value) this.fieldErrors.forgotEmail = 'Email is required';
      else if (!this.validateEmail(value)) this.fieldErrors.forgotEmail = 'Invalid email format';
      else this.fieldErrors.forgotEmail = '';
    } else {
      if (!value) this.fieldErrors.newPassword = 'Password is required';
      else if (!this.validatePassword(value)) this.fieldErrors.newPassword = 'Password must be alphanumeric and at least 6 characters';
      else this.fieldErrors.newPassword = '';
    }
  }

  /** -------------------
   * SUBMIT METHODS
   * ------------------- */
  onSubmit() {
    if (this.isLoginMode) {
      // validate login fields
      this.onLoginChange('email');
      this.onLoginChange('password');
      const hasError = this.fieldErrors.loginEmail || this.fieldErrors.loginPassword;
      if (hasError) return;

      this.deliveryService.loginDeliveryPerson(this.loginData.email, this.loginData.password).subscribe({
        next: () => {
          alert('Login successful');
          this.router.navigate(['/delivery-dashboard']);
        },
        error: (err) => {
          this.fieldErrors.loginEmail = err.error?.message || 'Login failed';
        }
      });

    } else {
      // validate all register fields
      Object.keys(this.registerData).forEach(field => this.onRegisterChange(field));
      const hasError = Object.values(this.fieldErrors).some(err => err !== '');
      if (hasError) return;

      this.deliveryService.registerDeliveryPerson(this.registerData).subscribe({
        next: () => {
          alert('Registration successful');
          this.toggleMode();
        },
        error: () => {
          this.fieldErrors.email = 'Registration failed';
        }
      });
    }
  }

  handleForgotPassword() {
    this.onForgotChange(this.emailVerified ? 'newPassword' : 'forgotEmail');
    const hasError = this.emailVerified ? !!this.fieldErrors.newPassword : !!this.fieldErrors.forgotEmail;
    if (hasError) return;

    if (!this.emailVerified) {
      this.deliveryService.verifyEmail(this.forgotEmail).subscribe({
        next: () => {
          this.emailVerified = true;
          this.fieldErrors.forgotEmail = '';
        },
        error: (err) => {
          this.fieldErrors.forgotEmail = err.error?.message || 'Email not found';
        }
      });
    } else {
      this.deliveryService.updatePassword(this.forgotEmail, this.newPassword).subscribe({
        next: () => {
          // 1️⃣ Send email via EmailJS
          emailjs.send(
            this.EMAILJS_SERVICE_ID,
            this.EMAILJS_TEMPLATE_ID,
            {
              to_email: this.forgotEmail,      
              // user_name: this.forgotEmail,    
              message: `Your password has been successfully updated. Your new password is: ${this.newPassword}`
            },
            this.EMAILJS_PUBLIC_KEY
          ).then((result) => {
            console.log('Email sent:', result.text);
            alert('Password updated successfully and email sent');
            this.cancelForgotPassword();
          }, (error) => {
            console.error('EmailJS error:', error.text);
            alert('Password updated but failed to send email');
            this.cancelForgotPassword();
          });
        },
        error: (err) => {
          this.fieldErrors.newPassword = err.error?.message || 'Password update failed';
        }
      });
    }
  }
}
