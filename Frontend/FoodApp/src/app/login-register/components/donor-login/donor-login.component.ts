import { Component } from '@angular/core';
import { DonorService } from '../../service/donor.service';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-donor-login',
  templateUrl: './donor-login.component.html',
  styleUrls: ['./donor-login.component.css']
})
export class DonorLoginComponent {
  isLoginMode = true;
  isForgotPasswordMode = false;
  emailVerified = false;
  EMAILJS_SERVICE_ID = 'service_8r4zy1v';   
  EMAILJS_TEMPLATE_ID = 'template_hbxdgbj'; 
  EMAILJS_PUBLIC_KEY = 'yBmE_EU9lg-NEnYb3';   


  // field-specific error messages
  fieldErrors: any = {
    name: '',
    email: '',
    password: '',
    contact: '',
    address: '',
    donorType: '',
    loginEmail: '',
    loginPassword: '',
    forgotEmail: '',
    newPassword: ''
  };

  errorMessage = '';

  loginData = { email: '', password: '' };
  registerData = { name: '', email: '', password: '', contact: '', address: '', donorType: 'Individual', role: 'DONOR' };
  forgotEmail = '';
  newPassword = '';

  constructor(private donorService: DonorService, private router: Router) {}

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
    for (let key in this.fieldErrors) this.fieldErrors[key] = '';
    this.errorMessage = '';
  }

  /** -------------------
   * VALIDATIONS
   * ------------------- */
  validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return passwordRegex.test(password);
  }

  onRegisterChange(field: string) {
    const value = (this.registerData as any)[field];
    switch (field) {
      case 'name': this.fieldErrors.name = value ? '' : 'Name is required'; break;
      case 'email':
        if (!value) this.fieldErrors.email = 'Email is required';
        else if (!this.validateEmail(value)) this.fieldErrors.email = 'Invalid email format';
        else this.fieldErrors.email = '';
        break;
      case 'password':
        if (!value) this.fieldErrors.password = 'Password is required';
        else if (!this.validatePassword(value)) this.fieldErrors.password = 'Password must be alphanumeric & min 6 chars';
        else this.fieldErrors.password = '';
        break;
      case 'contact': this.fieldErrors.contact = value ? '' : 'Contact is required'; break;
      case 'address': this.fieldErrors.address = value ? '' : 'Address is required'; break;
      case 'donorType': this.fieldErrors.donorType = value ? '' : 'Donor Type is required'; break;
    }
  }

  onLoginChange(field: string) {
    const value = (this.loginData as any)[field];
    if (field === 'email') {
      if (!value) this.fieldErrors.loginEmail = 'Email is required';
      else if (!this.validateEmail(value)) this.fieldErrors.loginEmail = 'Invalid email format';
      else this.fieldErrors.loginEmail = '';
    } else if (field === 'password') this.fieldErrors.loginPassword = value ? '' : 'Password is required';
  }

  onForgotChange(field: string) {
    const value = field === 'forgotEmail' ? this.forgotEmail : this.newPassword;
    if (field === 'forgotEmail') {
      if (!value) this.fieldErrors.forgotEmail = 'Email is required';
      else if (!this.validateEmail(value)) this.fieldErrors.forgotEmail = 'Invalid email format';
      else this.fieldErrors.forgotEmail = '';
    } else {
      if (!value) this.fieldErrors.newPassword = 'Password is required';
      else if (!this.validatePassword(value)) this.fieldErrors.newPassword = 'Password must be alphanumeric & min 6 chars';
      else this.fieldErrors.newPassword = '';
    }
  }

  /** -------------------
   * SUBMIT HANDLER
   * ------------------- */
  onSubmit() {
    if (this.isLoginMode) {
      this.onLoginChange('email');
      this.onLoginChange('password');
      if (this.fieldErrors.loginEmail || this.fieldErrors.loginPassword) return;

      this.donorService.loginDonor(this.loginData.email, this.loginData.password).subscribe({
        next: () => {
          alert('Login successful');
          this.router.navigate(['/donor-dashboard']);
        },
        error: (err) => this.fieldErrors.loginEmail = err.error?.message || 'Login failed'
      });
    } else {
      Object.keys(this.registerData).forEach(field => this.onRegisterChange(field));
      if (Object.values(this.fieldErrors).some(err => err)) return;

      this.donorService.registerDonor(this.registerData).subscribe({
        next: () => { alert('Registration successful'); this.toggleMode(); },
        error: () => this.fieldErrors.email = 'Registration failed'
      });
    }
  }

  handleForgotPassword() {
    this.onForgotChange(this.emailVerified ? 'newPassword' : 'forgotEmail');
    const hasError = this.emailVerified ? !!this.fieldErrors.newPassword : !!this.fieldErrors.forgotEmail;
    if (hasError) return;

    if (!this.emailVerified) {
      this.donorService.verifyEmail(this.forgotEmail).subscribe({
        next: () => { alert('Email verified. Set your new password.'); this.emailVerified = true; },
        error: () => this.fieldErrors.forgotEmail = 'Email not found'
      });
    } else {
      this.donorService.updatePassword(this.forgotEmail, this.newPassword).subscribe({
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
