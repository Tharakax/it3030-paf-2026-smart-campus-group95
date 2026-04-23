# UniSync - Smart Campus Operations Hub

![UniSync Logo](frontend/src/assets/logo.png)

UniSync is an advanced, unified campus operations platform designed to streamline incident management and resource booking across modern educational ecosystems. It provides a mission-critical "Command Center" aesthetic for administrative oversight while offering a seamless, intuitive experience for students and faculty.

## 🚀 Key Modules

### 🏛️ Module A – Facilities & Assets Catalogue
- **Operational Registry:** Comprehensive database of all campus assets and facilities.
- **Visual Insights:** High-fidelity galleries and resource descriptions for students and staff.

### 📅 Module B – Booking Management
- **Integrated Scheduling:** Centralized system for reserving campus spaces and resources.
- **Lifecycle Control:** Automated workflows for reservation requests, approvals, and scheduling conflicts.

### 🛠️ Module C – Maintenance & Incident Ticketing
- **Intelligent Reporting:** Sophisticated multi-step reporting flow with category-based routing.
- **Specialized Assignments:** Strict logic that ensures incidents are handled by technicians matching the specific domain (e.g., IT, Plumbing).
- **Consolidated Tracking:** Visual progress steppers synchronized across all user roles.

### 🔔 Module D – Notifications
- **Automated Alerts:** Real-time system notifications for ticket status updates and assignment alerts.
- **Broadcast System:** Administrative capabilities to send global notifications to campus users.

### 🔐 Module E – Authentication & Authorization
- **Secure Identity:** Multi-layered authentication via Google OAuth 2.0 and JWT.
- **Granular Permissions:** Role-based access control (RBAC) defining clear boundaries for ADMIN, TECHNICIAN, and USER roles.


## 💻 Tech Stack

### Frontend
- **Framework:** React 18 (Vite JS)
- **Styling:** Tailwind CSS (Premium "Command Center" Aesthetic)
- **Icons:** Lucide React
- **State Management:** React Context API (Auth & Session)
- **Networking:** Axios with JWT interceptors

### Backend
- **Framework:** Spring Boot 3
- **Security:** Spring Security + OAuth2 Client
- **Persistence:** MongoDB (NoSQL)
- **Storage:** Supabase (Cloud Image & Media Hosting)

## 🛠️ Getting Started

### Prerequisites
- **Java:** JDK 21
- **Node.js:** v20+
- **Database:** MySQL Server (running on `localhost:3306`)
- **Maven:** For backend dependency management

### 1. Database Configuration
1. The project uses **MongoDB** as its primary data store.
2. Ensure you have a MongoDB instance running (locally or on Atlas).
3. Update the connection URI in `backend/src/main/resources/application.yml`.
   ```yaml
   spring:
     data:
       mongodb:
         uri: YOUR_MONGODB_URI
   ```

### 2. Google OAuth2 Integration
1. Obtain credentials from the [Google Cloud Console](https://console.cloud.google.com/).
2. Set the redirect URI to: `http://localhost:8080/login/oauth2/code/google`
3. Configure your `application.yml` in the backend:
   ```yaml
   spring:
     security:
       oauth2:
         client:
           registration:
             google:
               client-id: YOUR_CLIENT_ID
               client-secret: YOUR_CLIENT_SECRET
   ```

### 3. Deployment Steps

#### Backend (Spring Boot)
```bash
cd backend
./mvnw clean spring-boot:run
```
*API Endpoint: `http://localhost:8080`*

#### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
*Webapp Endpoint: `http://localhost:5173`*

## 📁 Project Structure

```bash
├── backend/                # Spring Boot REST API
│   ├── src/main/java/      # Java Source Code
│   └── src/main/resources/ # Configuration & Assets
├── frontend/               # React + Vite Application
│   ├── src/components/     # Reusable UI Components
│   └── src/pages/          # Top-level Page Views
└── README.md               # Global Documentation
```

---
Built with ❤️ by the IT3030 Smart Campus Group 95.
