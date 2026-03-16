# RevWorkforce API Documentation

This document provides a comprehensive overview of all RESTful API endpoints available in the RevWorkforce microservices architecture. It is based on the controller definitions found across the system.

---

## Service: User Service

### Authentication (`/auth`)

*   **`POST /auth/login`**
    *   **Description**: Authenticate a user and receive a JWT token.
    *   **Request Body**: `LoginRequest`
    *   **Response**: `LoginResponse` (200 OK)
    *   **Security**: Public

*   **`PUT /auth/change-password`**
    *   **Description**: Change the password for the current user.
    *   **Request Body**: `ChangePasswordRequest`
    *   **Response**: `String` (200 OK)
    *   **Security**: Authenticated User

### Users (`/users`)

*   **`POST /users`**
    *   **Description**: Create a new user.
    *   **Request Body**: `CreateUserRequest`
    *   **Response**: `User` (201 Created)
    *   **Security**: Requires Role `ADMIN`

*   **`GET /users`**
    *   **Description**: Get a list of all users.
    *   **Response**: `List<User>` (200 OK)
    *   **Security**: Requires Role `ADMIN`

*   **`GET /users/{id}`**
    *   **Description**: Get a user by their ID.
    *   **Path Variable**: `id` (Long)
    *   **Response**: `User` (200 OK)
    *   **Security**: Authenticated User

---

## Service: Employee Service

### Employees (`/employees`)

*   **`POST /employees`**
    *   **Description**: Create a new employee profile.
    *   **Request Body**: `Employee`
    *   **Response**: `Employee` (201 Created)
    *   **Security**: Requires Role `ADMIN` or `HR`

*   **`GET /employees`**
    *   **Description**: Get a list of all employees.
    *   **Response**: `List<Employee>` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /employees/{id}`**
    *   **Description**: Get an employee by their ID.
    *   **Path Variable**: `id` (Long)
    *   **Response**: `Employee` (200 OK)
    *   **Security**: Authenticated User

*   **`PUT /employees/{id}`**
    *   **Description**: Update an employee's details.
    *   **Path Variable**: `id` (Long)
    *   **Request Body**: `Employee`
    *   **Response**: `Employee` (200 OK)
    *   **Security**: Requires Role `ADMIN` or `HR`

*   **`DELETE /employees/{id}`**
    *   **Description**: Delete an employee.
    *   **Path Variable**: `id` (Long)
    *   **Response**: (204 No Content)
    *   **Security**: Requires Role `ADMIN`

*   **`GET /employees/with-user/{id}`**
    *   **Description**: Get employee details merged with user details.
    *   **Path Variable**: `id` (Long)
    *   **Response**: `Map<String, Object>` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /employees/count`**
    *   **Description**: Get the total number of employees.
    *   **Response**: `Long` (200 OK)
    *   **Security**: Authenticated User

### Departments (`/departments`)

*   **`POST /departments`**
    *   **Description**: Create a new department.
    *   **Request Body**: `Department`
    *   **Response**: `Department` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /departments`**
    *   **Description**: Get a list of all departments.
    *   **Response**: `List<Department>` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /departments/{id}`**
    *   **Description**: Get a department by ID.
    *   **Path Variable**: `id` (Long)
    *   **Response**: `Department` (200 OK)
    *   **Security**: Authenticated User

*   **`PUT /departments/{id}`**
    *   **Description**: Update a department.
    *   **Path Variable**: `id` (Long)
    *   **Request Body**: `Department`
    *   **Response**: `Department` (200 OK)
    *   **Security**: Authenticated User

*   **`DELETE /departments/{id}`**
    *   **Description**: Delete a department.
    *   **Path Variable**: `id` (Long)
    *   **Response**: (200 OK)
    *   **Security**: Authenticated User

### Designations (`/designations`)

*   **`POST /designations`**
    *   **Description**: Create a new designation.
    *   **Request Body**: `Designation`
    *   **Response**: `Designation` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /designations`**
    *   **Description**: Get a list of all designations.
    *   **Response**: `List<Designation>` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /designations/{id}`**
    *   **Description**: Get a designation by ID.
    *   **Path Variable**: `id` (Long)
    *   **Response**: `Designation` (200 OK)
    *   **Security**: Authenticated User

*   **`PUT /designations/{id}`**
    *   **Description**: Update a designation.
    *   **Path Variable**: `id` (Long)
    *   **Request Body**: `Designation`
    *   **Response**: `Designation` (200 OK)
    *   **Security**: Authenticated User

*   **`DELETE /designations/{id}`**
    *   **Description**: Delete a designation.
    *   **Path Variable**: `id` (Long)
    *   **Response**: (200 OK)
    *   **Security**: Authenticated User

---

## Service: Leave Service

### Leaves (`/api/leaves`)

*   **`POST /api/leaves/apply`**
    *   **Description**: Apply for a new leave.
    *   **Request Body**: `LeaveApplicationRequest`
    *   **Response**: `LeaveRequest` (200 OK)
    *   **Security**: Authenticated User

*   **`POST /api/leaves/approve`**
    *   **Description**: Approve or reject a leave application.
    *   **Request Body**: `LeaveApprovalRequest`
    *   **Response**: `LeaveRequest` (200 OK)
    *   **Security**: Requires Role `ADMIN` or `MANAGER`

*   **`GET /api/leaves/history/{employeeId}`**
    *   **Description**: Get leave history for a specific employee.
    *   **Path Variable**: `employeeId` (Long)
    *   **Response**: `List<LeaveRequest>` (200 OK)
    *   **Security**: Authenticated User

*   **`GET /api/leaves/balances/{employeeId}`**
    *   **Description**: Get current leave balances for a specific employee.
    *   **Path Variable**: `employeeId` (Long)
    *   **Response**: `List<LeaveBalance>` (200 OK)
    *   **Security**: Authenticated User

*   **`POST /api/leaves/initialize/{employeeId}`**
    *   **Description**: Initialize leave balances for a new employee.
    *   **Path Variable**: `employeeId` (Long)
    *   **Response**: `String` (200 OK)
    *   **Security**: Requires Role `ADMIN`

---

## Service: Performance Service

### Performance (`/api/performance`)

*   **`POST /api/performance/self-review`**
    *   **Description**: Submit an employee self-review.
    *   **Query Parameters**: `employeeId` (Long)
    *   **Request Body**: `String` (selfReview content)
    *   **Response**: `PerformanceReview` (200 OK)
    *   **Security**: Authenticated User

*   **`POST /api/performance/manager-feedback/{reviewId}`**
    *   **Description**: Submit manager feedback for a review.
    *   **Path Variable**: `reviewId` (Long)
    *   **Query Parameters**: `managerId` (Long), `feedback` (String), `rating` (Integer)
    *   **Response**: `PerformanceReview` (200 OK)
    *   **Security**: Requires Role `MANAGER` or `ADMIN`

*   **`GET /api/performance/history/{employeeId}`**
    *   **Description**: Get performance review history for an employee.
    *   **Path Variable**: `employeeId` (Long)
    *   **Response**: `List<PerformanceReview>` (200 OK)
    *   **Security**: Authenticated User

*   **`POST /api/performance/goals`**
    *   **Description**: Add a new performance goal.
    *   **Request Body**: `Goal`
    *   **Response**: `Goal` (200 OK)
    *   **Security**: Requires Role `MANAGER` or `ADMIN`

*   **`GET /api/performance/goals/{employeeId}`**
    *   **Description**: Get performance goals for a specific employee.
    *   **Path Variable**: `employeeId` (Long)
    *   **Response**: `List<Goal>` (200 OK)
    *   **Security**: Authenticated User

---

## Service: Reporting Service

### Reports (`/api/reports`)

*   **`GET /api/reports/dashboard`**
    *   **Description**: Retrieve the comprehensive HR Dashboard Data summary.
    *   **Response**: `HRDashboardData` (200 OK)
    *   **Security**: Requires Role `ADMIN`

---

## Service: Notification Service

### Notifications (`/api/notifications`)

*   **`POST /api/notifications/send`**
    *   **Description**: Send a new notification to an employee.
    *   **Request Body**: `NotificationRequest`
    *   **Response**: `Notification` (200 OK)
    *   **Security**: Internal / Authenticated User

*   **`GET /api/notifications/{employeeId}`**
    *   **Description**: Get a list of notifications for a specific employee.
    *   **Path Variable**: `employeeId` (Long)
    *   **Response**: `List<Notification>` (200 OK)
    *   **Security**: Authenticated User
