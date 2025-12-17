import { Component } from '@angular/core';
import { NGOService } from '../../service/ngo.service';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-ngo-login',
  templateUrl: './ngo-login.component.html',
  styleUrls: ['./ngo-login.component.css']
})
export class NgoLoginComponent {
  isLoginMode = true;
  isForgotPasswordMode = false;
  emailVerified = false;

  EMAILJS_SERVICE_ID = 'service_8r4zy1v';   
  EMAILJS_TEMPLATE_ID = 'template_hbxdgbj'; 
  EMAILJS_PUBLIC_KEY = 'yBmE_EU9lg-NEnYb3';   

  fieldErrors: any = {
    loginEmail: '', loginPassword: '',
    name: '', registrationNumber: '', email: '', password: '',
    contactNumber: '', address: '', city: '', state: '', country: '',
    typeOfWork: '', founderName: '', yearOfEstablishment: '',
    forgotEmail: '', newPassword: ''
  };

  errorMessage = '';

  loginData = { email: '', password: '' };
  registerData = {
    name: '', registrationNumber: '', email: '', password: '',
    contactNumber: '', address: '', city: '', state: '', country: '',
    website: '', typeOfWork: '', founderName: '', yearOfEstablishment: 11,
    isActive: true, role: 'NGO'
  };

  forgotEmail = '';
  newPassword = '';

  constructor(private ngoService: NGOService, private router: Router) {}

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

  validateEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  validatePassword(password: string) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  }

  // ✅ Login validation
  validateLogin() {
    let hasError = false;
    if (!this.loginData.email) { this.fieldErrors.loginEmail = 'Email is required'; hasError = true; }
    else if (!this.validateEmail(this.loginData.email)) { this.fieldErrors.loginEmail = 'Invalid email format'; hasError = true; }
    else this.fieldErrors.loginEmail = '';

    if (!this.loginData.password) { this.fieldErrors.loginPassword = 'Password is required'; hasError = true; }
    else this.fieldErrors.loginPassword = '';

    return !hasError;
  }

  // ✅ Register validation
  validateRegister() {
    let hasError = false;
    Object.keys(this.registerData).forEach(field => {
      const value = (this.registerData as any)[field];
      switch (field) {
        case 'name': if(!value) { this.fieldErrors.name = 'NGO Name is required'; hasError = true; } else this.fieldErrors.name = ''; break;
        case 'registrationNumber': if(!value) { this.fieldErrors.registrationNumber = 'Registration Number is required'; hasError = true; } else this.fieldErrors.registrationNumber = ''; break;
        case 'email': 
          if(!value) { this.fieldErrors.email='Email is required'; hasError = true; } 
          else if(!this.validateEmail(value)) { this.fieldErrors.email='Invalid email format'; hasError = true; } 
          else this.fieldErrors.email=''; break;
        case 'password':
          if(!value) { this.fieldErrors.password='Password is required'; hasError=true; } 
          else if(!this.validatePassword(value)) { this.fieldErrors.password='Password must be alphanumeric & min 6 chars'; hasError=true; } 
          else this.fieldErrors.password=''; break;
        case 'contactNumber': if(!value) { this.fieldErrors.contactNumber='Contact Number is required'; hasError=true; } else this.fieldErrors.contactNumber=''; break;
        case 'address': if(!value) { this.fieldErrors.address='Address is required'; hasError=true; } else this.fieldErrors.address=''; break;
        case 'city': if(!value) { this.fieldErrors.city='City is required'; hasError=true; } else this.fieldErrors.city=''; break;
        case 'state': if(!value) { this.fieldErrors.state='State is required'; hasError=true; } else this.fieldErrors.state=''; break;
        case 'country': if(!value) { this.fieldErrors.country='Country is required'; hasError=true; } else this.fieldErrors.country=''; break;
        case 'typeOfWork': if(!value) { this.fieldErrors.typeOfWork='Type of Work is required'; hasError=true; } else this.fieldErrors.typeOfWork=''; break;
        case 'founderName': if(!value) { this.fieldErrors.founderName="Founder's Name is required"; hasError=true; } else this.fieldErrors.founderName=''; break;
        case 'yearOfEstablishment': if(!value) { this.fieldErrors.yearOfEstablishment='Year of Establishment is required'; hasError=true; } else this.fieldErrors.yearOfEstablishment=''; break;
      }
    });
    return !hasError;
  }

  // ✅ Submit
  onSubmit() {
    if(this.isLoginMode){
      if(!this.validateLogin()) return;

      this.ngoService.loginNGO(this.loginData.email, this.loginData.password).subscribe({
        next: () => { alert('Login successful'); this.router.navigate(['/ngo-dashboard']); },
        error: (err) => this.fieldErrors.loginEmail = err.error?.message || 'Login failed'
      });
    } else {
      if(!this.validateRegister()) return;

      this.ngoService.registerNGO(this.registerData).subscribe({
        next: () => { alert('Registration successful'); this.toggleMode(); },
        error: () => this.fieldErrors.email = 'Registration failed'
      });
    }
  }

  // ✅ Forgot Password
  handleForgotPassword() {
    const value = this.emailVerified ? this.newPassword : this.forgotEmail;
    if(!value){
      if(!this.emailVerified) this.fieldErrors.forgotEmail='Email is required';
      else this.fieldErrors.newPassword='Password is required';
      return;
    }

    if(!this.emailVerified){
      if(!this.validateEmail(this.forgotEmail)) { this.fieldErrors.forgotEmail='Invalid email format'; return; }
      this.ngoService.verifyEmail(this.forgotEmail).subscribe({
        next: () => { alert('Email verified. Set new password.'); this.emailVerified = true; },
        error: () => this.fieldErrors.forgotEmail='Email not found'
      });
    } else {
      if(!this.validatePassword(this.newPassword)) { this.fieldErrors.newPassword='Password must be alphanumeric & min 6 chars'; return; }

      this.ngoService.updatePassword(this.forgotEmail, this.newPassword).subscribe({
        next: () => {
          emailjs.send(
            this.EMAILJS_SERVICE_ID,
            this.EMAILJS_TEMPLATE_ID,
            { to_email:this.forgotEmail, message:`Your new password is: ${this.newPassword}` },
            this.EMAILJS_PUBLIC_KEY
          ).then(
            ()=> { alert('Password updated & email sent'); this.cancelForgotPassword(); },
            (err)=> { alert('Password updated but email failed'); this.cancelForgotPassword(); }
          );
        },
        error: (err) => this.fieldErrors.newPassword=err.error?.message || 'Password update failed'
      });
    }
  }
}
