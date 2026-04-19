# UniSync - Smart Campus Operations Hub

![UniSync Logo](frontend/src/assets/logo.png)

UniSync is an advanced, unified campus operations platform designed to streamline incident management and resource booking across modern educational ecosystems. It provides a mission-critical "Command Center" aesthetic for administrative oversight while offering a seamless, intuitive experience for students and faculty.

## 🚀 Key Modules

### 🛠️ Incident Management System
- **Intelligent Ticketing:** Multi-step reporting flow with category-based routing.
- **Smart Assignment:** Strict filtering that restricts technician assignment to their specific area of expertise (e.g., Electrical, IT Network, Plumbing).
- **Real-time Status Stepper:** A visual progress indicator synchronized across all user roles (Reporter, Admin, Technician).
- **Collaborative Flow:** Integrated comment system for real-time updates between technicians and users.

### 📅 Resource Booking
- **Campus-wide Management:** centralized control of campus resources and facilities.
- **Booking Lifecycle:** Automated workflows for reservation requests and approvals.

### 🔐 Security & Access Control
- **Unified Identity:** Single Sign-On (SSO) via Google OAuth 2.0.
- **Enterprise Security:** JWT-based authentication with role-specific authorization layers (ADMIN, TECHNICIAN, USER).
- **Audit Logging:** Comprehensive tracking of status changes and administrative actions.

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
- **Persistence:** MySQL + Spring Data JPA
- **Storage:** Supabase (Cloud Image & Media Hosting)

## 🛠️ Getting Started

### Prerequisites
- **Java:** JDK 21
- **Node.js:** v20+
- **Database:** MySQL Server (running on `localhost:3306`)
- **Maven:** For backend dependency management

### 1. Database Configuration
1. Initialize a MySQL database:
   ```sql
   CREATE DATABASE unisync;
   ```
2. The system utilizes Hibernate's `ddl-auto=update` to automatically generate the necessary schema upon first launch.

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
