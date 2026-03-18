# 🏢 RevWorkforce — HRM Microservices System

> A scalable, production-ready **Human Resource Management (HRM)** system built with a microservices architecture using **Spring Boot**, **Spring Cloud**, **MySQL**, and **Docker**.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Architecture](#️-architecture)
- [Microservices](#-microservices)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Inter-Service Communication](#-inter-service-communication)
- [Recommended Testing Order](#-recommended-testing-order)
- [Postman Collection Structure](#-postman-collection-structure)
- [Docker Setup](#-docker-setup)
- [Team](#-team)

---

## 🧭 Overview

**RevWorkforce** is a group project that implements a full-featured HRM platform using a microservices-based design. It handles everything from employee onboarding, leave management, and performance reviews to notifications and HR reporting — all behind a single **API Gateway** with **JWT-based authentication**.

Key highlights:
- Role-based access control (`ADMIN`, `HR`, `MANAGER`, `EMPLOYEE`)
- Centralized configuration via Spring Cloud Config Server
- Service registration & discovery via Netflix Eureka
- Inter-service communication via Feign Clients
- Fully containerized with Docker Compose

---

## 🏗️ Architecture

```
                        ┌──────────────────────────────┐
                        │       RevWorkforce UI         │
                        └──────────────┬───────────────┘
                                       │
                        ┌──────────────▼───────────────┐
                        │          API Gateway          │
                        │    Port: 8080 | JWT Auth      │
                        └──┬──────┬──────┬──────┬───┬──┘
                           │      │      │      │   │
                 ┌─────────┘  ┌───┘  ┌───┘  ┌──┘ ┌─┘
                 ▼            ▼      ▼      ▼     ▼
            User-Svc  Employee-Svc  Leave  Perf  Notify  Report
                 │            │      │      │      │        │
                 └────────────┴──────┴──────┴──────┴── MySQL┘
                                       │
              ┌────────────────────────┼──────────────────────────┐
              │                        │                           │
  ┌───────────▼────────────┐  ┌────────▼──────────┐               │
  │   service-discovery    │  │   config-server   │               │
  │  (Eureka Server :8761) │  │   (Port: 8888)    │               │
  │  All services register │  │  Centralised      │               │
  │  here on startup &     │  │  config for all   │               │
  │  discover each other   │  │  microservices    │               │
  └────────────────────────┘  └───────────────────┘               │
              │                        │                           │
              └────────────────────────┴───── used by all svcs ───┘
```

### Feign Client Dependencies

```
Employee Service  ──── calls ──►  User Service       (merge profile + account)
Leave Service     ──── calls ──►  Notification Svc   (alert on leave status change)
Reporting Service ──── calls ──►  Employee Service   (headcount for dashboard)
```

---

## 🔧 Microservices

| Service | Port | Description |
|---|---|---|
| **api-gateway** | `8080` | Single entry point, JWT validation, routing |
| **service-discovery** | `8761` | Netflix Eureka Server — all microservices register here on startup and discover each other by name (no hardcoded URLs) |
| **config-server** | `8888` | Centralized configuration management |
| **user-service** | — | Authentication, user management, JWT issuance |
| **employee-service** | — | Employee profiles, departments, designations |
| **leave-service** | — | Leave application, approval, balance tracking |
| **performance-service** | — | Self-reviews, manager feedback, goals |
| **notification-service** | — | In-app notifications for employees |
| **reporting-service** | — | HR dashboard and aggregated analytics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 17+ |
| Framework | Spring Boot, Spring Cloud |
| API Gateway | Spring Cloud Gateway |
| Service Discovery | Netflix Eureka |
| Config Management | Spring Cloud Config |
| Inter-service Comms | OpenFeign |
| Security | Spring Security + JWT |
| Database | MySQL 8.0 |
| Containerization | Docker, Docker Compose |
| Build Tool | Maven |

---

## 📁 Project Structure

```
Revworkforce-Microservices-P3/
├── api-gateway/               # API Gateway — routing + JWT filter
├── config-server/             # Centralized config server
├── service-discovery/         # Eureka server
├── user-service/              # Auth, login, user CRUD
├── employee-service/          # Employee, department, designation APIs
├── leave-service/             # Leave management + balance tracking
├── performance-service/       # Performance reviews & goals
├── notification-service/      # Notification system
├── reporting-service/         # HR reporting & dashboard
├── revworkforce-ui/           # Frontend UI
├── docker-compose.yml         # Full stack Docker orchestration
├── Dockerfile.template        # Shared Dockerfile for all services
├── pom.xml                    # Root Maven POM (multi-module)
├── .env.example               # Sample environment variables
└── api_documentation.md       # Detailed API reference
```

---

## 🚀 Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- Docker & Docker Compose
- MySQL 8.0 (or use the bundled Docker container)

### ▶ Run with Docker (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Harshita188/Revworkforce-Microservices-P3.git
cd Revworkforce-Microservices-P3

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env and set JWT_SECRET

# 3. Build and start all services
docker-compose up --build
```

| URL | Description |
|---|---|
| `http://localhost:8080` | API Gateway (all requests go here) |
| `http://localhost:8761` | **Eureka Dashboard** (service-discovery — check registered services) |
| `http://localhost:8888` | Config Server |

### ▶ Run Locally (Manual)

Start services **in this exact order**:

```bash
# 1. Start MySQL (or use Docker: docker run -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.0)

# 2. Eureka Server
cd service-discovery && mvn spring-boot:run

# 3. Config Server
cd config-server && mvn spring-boot:run

# 4. API Gateway
cd api-gateway && mvn spring-boot:run

# 5. All business microservices (in any order)
cd user-service && mvn spring-boot:run
cd employee-service && mvn spring-boot:run
cd leave-service && mvn spring-boot:run
cd performance-service && mvn spring-boot:run
cd notification-service && mvn spring-boot:run
cd reporting-service && mvn spring-boot:run
```

---

## 🔑 Environment Variables

Create a `.env` file at the project root based on `.env.example`:

```env
JWT_SECRET=your_super_secret_jwt_key_here
DB_USERNAME=root
DB_PASSWORD=root
```

All microservices fetch their configuration from the **Config Server** on startup. The `JWT_SECRET` is injected into every service that validates tokens.

---

## 📡 API Reference

> All requests go through the **API Gateway** at `http://localhost:8080`.  
> Protected endpoints require: `Authorization: Bearer <token>`  
> Roles: `ADMIN` · `HR` · `MANAGER` · `EMPLOYEE`

---

### 🔐 Auth & Users — `/auth`, `/users`

**Login**
```http
POST /auth/login
```
```json
// Request
{ "username": "admin", "password": "password123" }

// Response 200
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "email": "admin@revworkforce.com",
  "role": "ADMIN",
  "tokenType": "Bearer"
}
```

**Change Password**
```http
PUT /auth/change-password       🔒 Authenticated
```
```json
{ "oldPassword": "oldPass123", "newPassword": "newPass456" }
```

**User Management**

| Method | Endpoint | Role |
|---|---|---|
| `POST` | `/users` | ADMIN |
| `GET` | `/users` | ADMIN |
| `GET` | `/users/{id}` | Authenticated |

```json
// POST /users — Request body
{
  "username": "jdoe",
  "password": "password123",
  "email": "jdoe@revworkforce.com",
  "role": "EMPLOYEE"
}
```

---

### 👤 Employee Management — `/employees`

| Method | Endpoint | Role |
|---|---|---|
| `POST` | `/employees` | ADMIN / HR |
| `GET` | `/employees` | Authenticated |
| `GET` | `/employees/{id}` | Authenticated |
| `PUT` | `/employees/{id}` | ADMIN / HR |
| `DELETE` | `/employees/{id}` | ADMIN |
| `GET` | `/employees/with-user/{id}` | Authenticated |
| `GET` | `/employees/count` | Authenticated |

```json
// POST /employees — Request body
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@revworkforce.com",
  "phone": "1234567890",
  "dateOfJoining": "2024-03-14",
  "departmentId": 1,
  "designationId": 2,
  "userId": 5
}
```

**Departments** — `/departments`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/departments` | Create department |
| `GET` | `/departments` | List all departments |
| `GET` | `/departments/{id}` | Get by ID |
| `PUT` | `/departments/{id}` | Update |
| `DELETE` | `/departments/{id}` | Delete |

**Designations** — `/designations`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/designations` | Create designation |
| `GET` | `/designations` | List all |
| `GET` | `/designations/{id}` | Get by ID |
| `PUT` | `/designations/{id}` | Update |
| `DELETE` | `/designations/{id}` | Delete |

---

### 🏖️ Leave Management — `/api/leaves`

| Method | Endpoint | Role |
|---|---|---|
| `POST` | `/api/leaves/apply` | Authenticated |
| `POST` | `/api/leaves/approve` | ADMIN / MANAGER |
| `GET` | `/api/leaves/history/{employeeId}` | Authenticated |
| `GET` | `/api/leaves/balances/{employeeId}` | Authenticated |
| `POST` | `/api/leaves/initialize/{employeeId}` | ADMIN |

```json
// POST /api/leaves/apply — Request body
{
  "employeeId": 5,
  "leaveType": "SICK_LEAVE",
  "startDate": "2026-04-01",
  "endDate": "2026-04-02",
  "reason": "Feeling unwell"
}

// POST /api/leaves/approve — Request body
{
  "requestId": 12,
  "status": "APPROVED",
  "managerRemarks": "Approved"
}
```

---

### 📊 Performance Management — `/api/performance`

| Method | Endpoint | Role |
|---|---|---|
| `POST` | `/api/performance/self-review?employeeId={id}` | Authenticated |
| `POST` | `/api/performance/manager-feedback/{reviewId}` | MANAGER / ADMIN |
| `GET` | `/api/performance/history/{employeeId}` | Authenticated |
| `POST` | `/api/performance/goals` | MANAGER / ADMIN |
| `GET` | `/api/performance/goals/{employeeId}` | Authenticated |

```json
// POST /api/performance/goals — Request body
{
  "employeeId": 5,
  "title": "Learn Spring Cloud",
  "description": "Complete the microservices course",
  "targetDate": "2026-06-30"
}
```

Manager feedback is submitted via query params:
```
POST /api/performance/manager-feedback/3?managerId=2&feedback=Great job!&rating=5
```

---

### 🔔 Notifications — `/api/notifications`

| Method | Endpoint | Role |
|---|---|---|
| `POST` | `/api/notifications/send` | Internal / Authenticated |
| `GET` | `/api/notifications/{employeeId}` | Authenticated |

```json
// POST /api/notifications/send — Request body
{
  "recipientId": 5,
  "message": "Your leave has been approved",
  "type": "LEAVE_STATUS"
}
```

---

### 📈 Reporting — `/api/reports`

| Method | Endpoint | Role |
|---|---|---|
| `GET` | `/api/reports/dashboard` | ADMIN |

```json
// GET /api/reports/dashboard — Response
{
  "totalEmployees": 150,
  "pendingLeavesCount": 8,
  "openPerformanceReviews": 12
}
```

---

## 🔗 Inter-Service Communication

Services communicate internally using **Feign Clients** (no direct DB sharing):

| Caller | Calls | Purpose |
|---|---|---|
| Employee Service | User Service | Merge employee profile with user account info |
| Leave Service | Notification Service | Trigger alerts on leave approval/rejection |
| Reporting Service | Employee Service | Fetch headcount data for HR dashboard |

---

## 🧪 Recommended Testing Order

Test the services in this sequence to avoid dependency failures:

1. **User Service** — Login to get JWT token
2. **Employee Service** — Create departments → designations → employees
3. **Leave Service** — Initialize leave balances → apply for leave → approve
4. **Performance Service** — Add goals → submit self-review → add manager feedback
5. **Notification Service** — Verify notifications triggered by leave/performance events
6. **Reporting Service** — Check dashboard reflects all created data

---

## 📬 Postman Collection Structure

Organize your Postman collection as follows:

```
RevWorkforce/
├── AUTH
│   ├── Login
│   └── Change Password
├── ADMIN - Setup
│   ├── Create User
│   ├── Create Department
│   ├── Create Designation
│   └── Create Employee
├── EMPLOYEE - Actions
│   ├── Apply Leave
│   ├── View Leave Balance
│   ├── Submit Self-Review
│   └── View Notifications
├── MANAGER - Actions
│   ├── Approve Leave
│   ├── Provide Manager Feedback
│   └── Add Performance Goal
└── REPORTING
    └── Get HR Dashboard
```

> 💡 Set `{{base_url}}` = `http://localhost:8080` and `{{token}}` = JWT from login as Postman environment variables.

---

## 🐳 Docker Setup

The `docker-compose.yml` brings up the entire stack with correct startup ordering:

```
MySQL ──► service-discovery (Eureka :8761) ──► config-server (:8888) ──► api-gateway (:8080) ──► All Microservices
```

> ⚠️ **service-discovery (Eureka) must start first** — every other service registers itself with Eureka on boot. If Eureka is not up, services cannot find each other.

Key details:
- **service-discovery** runs on port `8761` — visit `http://localhost:8761` to see the Eureka dashboard and confirm all services are registered
- All services connect to the same `mysql` container
- Each service registers itself with Eureka on startup
- Config Server runs in `native` profile (reads local config files)
- The API Gateway is the **only** service exposed publicly on port `8080`
- A persistent `mysql_data` volume is used so data survives container restarts

```bash
# Start everything
docker-compose up --build

# Stop everything
docker-compose down

# Wipe DB data too
docker-compose down -v
```

---

## 👥 Team

This is a group project built as part of the **Revature** training program.

| Contributor | GitHub |
|---|---|
| Harshita | [@Harshita188](https://github.com/Harshita188) |
| *(Add teammates here)* | — |

---

## 📄 License

This project is for educational purposes as part of a Revature training program.

---

> **RevWorkforce** — Empowering HR with modern microservices. 🚀
