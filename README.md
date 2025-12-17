# Food Donation Website (Feedo)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Overview

The Food Donation Website is a platform designed to reduce food wastage by connecting donors, NGOs, and volunteers. It features four roles — Donor, NGO, Admin, and Delivery Man (Volunteer). The system includes a machine learning model to check food freshness before donation, NGO approval workflows, delivery tracking with maps(not implemeted yet), and an admin dashboard with detailed reports.

---

## Roles & Workflow

- **Donor:** Can donate or sell food. Food freshness is verified through an ML model.
- **NGO:** Reviews and accepts donated food.
- **Delivery Man (Volunteer):** Picks up food from donor and delivers it to NGO; delivery is trackable on a map.
- **Admin:** Manages users and views monthly reports, graphs, and charts on food donations and deliveries.

---

## Features

- ML-based food freshness detection (using Roboflow)
- Donation and selling options for donors
- NGO approval system for donated food
- Live delivery tracking via Leaflet maps
- Role-based feedback system
- Secure login/logout with HTTPS sessions
- Admin dashboard with analytics and reports

---

## Security Features

Session-Based Authentication
Secure login system using HTTPS sessions 

Password Hashing
Passwords encrypted using BCrypt

CORS Protection
Configured to allow only authorized frontend access

Input Validation
All user inputs are validated and sanitized

API Key Protection
API keys (Roboflow, EmailJS) are not exposed or logged in console

---

## Technology Stack

| Layer          | Technology             |
| -------------- | ---------------------- |
| Frontend       | Angular + Angular Material |
| Backend        | Spring Boot (Java)     |
| Machine Learning Model | Roboflow           |
| Mapping        | Leaflet.js             |
| Database       | MySql                  |

---
## Project Working Videos

All working demo videos (role-wise flow, ML detection, delivery tracking, admin dashboard) are available here:

📂 Google Drive Folder:
👉 https://drive.google.com/drive/folders/19uLHQBwB35407CiAry9qUoQ6yytQs3Qk?usp=sharing

---

## 📈 Future Improvements
-Integrate real-time notifications for donors and NGOs.
-Enhance ML model accuracy for freshness detection.
-Implement multiple delivery tracking with geofencing.

## Installation & Running Locally
🌐 Live Deployment

Frontend (Netlify):
👉 **Frontend** : https://foodwaste13-frontend.netlify.app/

👉**Backend API** (Render): https://backend-01-live-food.onrender.com

 🌐Localhost

1. **Frontend**: Open your browser and go to `http://localhost:4200`
2. **Backend API**: Available at `http://localhost:8080`

----

## External APIs Used

Roboflow API
→ Used for food freshness detection via image upload

EmailJS API
→ Used for sending emails (notifications / confirmations)

--- 
### Prerequisites

- Java 11 or higher
- Node.js & npm
- Angular CLI
- Maven
- Database setup (e.g., MySQL)

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run

