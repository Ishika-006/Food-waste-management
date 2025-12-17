import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';



@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
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
    location: '',
    address: '',
    loginEmail: '',
    loginPassword: '',
    forgotEmail: '',
    newPassword: ''
  };

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    name: '',
    email: '',
    password: '',
    location: '',
    address: '',
    role: 'ADMIN'
  };

  forgotEmail = '';
  newPassword = '';

  constructor(private adminService: AdminService, private router: Router) {}

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.isForgotPasswordMode = false;
    this.clearErrors();
  }

  showForgotPassword() {
    this.isForgotPasswordMode = true;
    this.clearErrors();
  }

  cancelForgotPassword() {
    this.isForgotPasswordMode = false;
    this.emailVerified = false;
    this.forgotEmail = '';
    this.newPassword = '';
    this.clearErrors();
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
      case 'location':
        this.fieldErrors.location = value ? '' : 'Location is required';
        break;
      case 'address':
        this.fieldErrors.address = value ? '' : 'Address is required';
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
      if (!this.loginData.email || !this.loginData.password) {
        this.onLoginChange('email');
        this.onLoginChange('password');
        return;
      }

      this.adminService.loginAdmin(this.loginData.email, this.loginData.password).subscribe({
        next: () => {
          alert('Login successful');
          this.router.navigate(['/admin-dashboard']);
        },
        error: (err) => {
          this.fieldErrors.loginEmail = err.error?.message || 'Login failed';
        }
      });

    } else {
      // check all fields before submit
      Object.keys(this.registerData).forEach(field => this.onRegisterChange(field));
      const hasError = Object.values(this.fieldErrors).some(err => err !== '');
      if (hasError) return;

      this.adminService.registerAdmin(this.registerData).subscribe({
        next: (res: any) => {
          alert(res.message || 'Registration successful');
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
      this.adminService.verifyEmail(this.forgotEmail).subscribe({
        next: () => {
          this.emailVerified = true;
          this.fieldErrors.forgotEmail = '';
        },
        error: (err) => {
          this.fieldErrors.forgotEmail = err.error?.message || 'Email not found';
        }
      });
    } else {
      this.adminService.updatePassword(this.forgotEmail, this.newPassword).subscribe({
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
