# School Management System API Documentation

## Overview

This RestAPI provides endpoints to manage schools, classrooms, and users for a school management system. It supports CRUD operations and allows searching for schools, users, and classrooms. Access is restricted based on user roles (`admin` - for school administrators or `superadmin` - for full access), with superadmins having full access to all endpoints.

---

## Setup

- Install dependencies

```bash
npm install
```

or

```bash
yarn
```

## Environment variables

Create the following variables into a `.env` file placed in the project root folder. Example values are added

```bash
LONG_TOKEN_SECRET=0zsblqAWXpTitbcknJ90v7plpCp6XGexe9WBCjheZxr8aFvWAq
SHORT_TOKEN_SECRET=cgRVqv0zrj07gz5uB0cgdktLLjJPmXcZFDs4u30Adnk3wQSOKG
NACL_SECRET=n2ejdLvGtIpDX1Ka4uDHxeZAuK0mE8OPxZLcsVYntgU9LMxRJm
MONGO_URI=mongodb://127.0.0.1:27017/axion
REDIS_URI=redis://127.0.0.1:6379
SUPER_ADMIN_USERNAME=
SUPER_ADMIN_EMAIL=
SUPER_ADMIN_PASSWORD=
```

## Run the API

```bash
nodemon
```

or

```bash
node app.js
```

## Seed Initial Admin

- **POST** : `/api/seed/createDefaultSuperAdmin`
  - Description: Seeds the system with a default super admin user passed in evironment variable or request body.
  - **Request**: (Optional)
    ```json
    {
      "username": "superadmin",
      "email": "superadmin@host.com",
      "role": "superadmin",
      "password": "12345678"
    }
    ```
  - **Response**: [`201`, `400`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "username": "superadmin",
        "email": "superadmin@host.com",
        "password": "***",
        "role": "superadmin",
        "_id": "6765fc6892069adbd97b7543",
        "createdAt": "2024-12-20T23:23:20.406Z",
        "updatedAt": "2024-12-20T23:23:20.406Z"
      },
      "errors": [],
      "message": "Default superadmin seeded successfully"
    }
    ```

## Running tests

```bash
npm run test
```

or

```bash
yarn test
```

---

## Authentication Flow

All endpoints are secured and require a valid token for access. Authentication is performed using JWT tokens, which must be passed in the `Authorization` header as `Basic <Buffer.from(<email>:<password>).toString("base64")>`.

#### Authentication Endpoint

- **POST** : `/api/user/auth`
  - **Description**: Authenticates a user and returns a token.
  - **Header**:
    ```json
    {
      "Authorization": `Basic <Buffer.from(<email>:<password>).toString("base64")>`
    }
    ```
  - **Response**: [`200`, `400`, `401`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": "<JWT_TOKEN>",
      "errors": [],
      "message": ""
    }
    ```

---

## Authorization Flow

Middlewares were created to authorize requests

- `__auth`: Used to authenticate users to generate the token used to authorize the requests

- `__superAdmin`: Used to authorize and ensure that requests are coming in from a superadmin

- `__admin`: Used to authorize and ensure that requests is from either a school admin (`admin`) or a super admin (`superadmin`)

- `__school`: Used to authorize and ensure that a school admin has unlimited access (or necessary assignment) to manage a school resource

---

## API Endpoints

- Assumptions
  - since all requests follow `/api/:moduleName/:fnName`, we can't follow all standard RestAPI practice.
    - In the case of GET, `id` parameter can only be passed in the query instead of the path
    - In the case of DELETE, `id` parameter can only be passed in the query instead of the path

### Users (managed by superadmins only)

#### Health check

- **HEAD** : `/api/user/health`
  - **Description:** A lightweight check to verify the health of the user module
  - **Response:** [`200`, `400`, `401`, `403`, `429`, `500`]

#### 1. Create a User

- **POST** : `/api/user/createUser`

  - **Description**: Creates a new user
  - **Request**:
    ```json
    {
      "username": "admin",
      "email": "admin@host.com",
      "role": "admin",
      "password": "12345678"
    }
    ```
  - **Response**: [`201`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "username": "admin",
        "email": "admin@host.com",
        "password": "***",
        "role": "admin",
        "_id": "6765fc6892069adbd97b7543",
        "createdAt": "2024-12-20T23:23:20.406Z",
        "updatedAt": "2024-12-20T23:23:20.406Z"
      },
      "errors": [],
      "message": "User created successfully"
    }
    ```

#### 2. Get All Users

- **GET** :`/user/getUsers`

  - **Description**: Fetches a list of users
  - **Request**:
    Query parameters: `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]

    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f2398172fb14b6d99630",
          "username": "superadmin",
          "email": "superadmin@host.com",
          "role": "superadmin",
          "createdAt": "2024-12-20T22:39:53.687Z",
          "updatedAt": "2024-12-20T22:39:53.687Z"
        },
        {
          "_id": "6765fc6892069adbd97b7543",
          "username": "admin",
          "email": "admin@host.com",
          "role": "admin",
          "createdAt": "2024-12-20T23:23:20.406Z",
          "updatedAt": "2024-12-20T23:23:20.406Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 3. Get User by ID

- **GET** : `/api/user/getUserById`
  - **Description**: Fetches a user by ID
  - **Request**:
    Query parameter: `id=6765fc6892069adbd97b7543`
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765fc6892069adbd97b7543",
        "username": "admin",
        "email": "admin@host.com",
        "role": "admin",
        "createdAt": "2024-12-20T23:23:20.406Z",
        "updatedAt": "2024-12-20T23:23:20.406Z"
      },
      "errors": [],
      "message": ""
    }
    ```

#### 4. Search Users

- **GET** : `/api/user/searchUser`
  - **Description**: Fetches a list of users that match the search criteria
  - **Request**:
    Query parameters: `search=admin`, `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765fc6892069adbd97b7543",
          "username": "admin",
          "email": "admin@host.com",
          "role": "admin",
          "createdAt": "2024-12-20T23:23:20.406Z",
          "updatedAt": "2024-12-20T23:23:20.406Z"
        },
        {
          "_id": "6765f2398172fb14b6d99630",
          "username": "superadmin",
          "email": "superadmin@host.com",
          "role": "superadmin",
          "createdAt": "2024-12-20T22:39:53.687Z",
          "updatedAt": "2024-12-20T22:39:53.687Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 5. Update User

- **PUT** : `/api/user/updateUser`
  - **Description**: Updates a user's details
  - **Request**:
    ```json
    {
      "id": "6765fc6892069adbd97b7543",
      "role": "superadmin"
    }
    ```
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765fc6892069adbd97b7543",
        "username": "admin",
        "email": "admin@host.com",
        "role": "superadmin",
        "createdAt": "2024-12-20T23:23:20.406Z",
        "updatedAt": "2024-12-20T23:25:40.667Z"
      },
      "errors": [],
      "message": "User updated successfully"
    }
    ```

#### 6. Delete User

- **DELETE** : `/api/user/deleteUser`
  - **Description**: Deletes a user
  - **Request**:
    Path parameter: `id=6765fc6892069adbd97b7543`
  - **Response**: [`200`, `400`, `401`, `404`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {},
      "errors": [],
      "message": "User deleted successfully"
    }
    ```

---

### Schools (managed by superadmins only)

#### Health check

- **HEAD** : `/api/school/health`
  - **Description:** A lightweight check to verify the health of the school module
  - **Response:** [`200`, `400`, `401`, `403`, `429`, `500`]

#### 1. Create a School

- **POST** : `/api/school/createSchool`

  - **Description**: Creates a new school
  - **Request**:

    ```json
    {
      "name": "Spring High School",
      "address": "742 Evergreen Terrace, Springfield, IL, 62701",
      "phone": "+1234567890",
      "email": "contact@springhigh.edu",
      "type": "public",
      "website": "http://www.springfieldhigh.edu"
    }
    ```

  - **Response**: [`201`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "name": "Spring High School",
        "address": "742 Evergreen Terrace, Springfield, IL, 62701",
        "phone": "+1234567890",
        "email": "contact@springhigh.edu",
        "website": "http://www.springfieldhigh.edu",
        "type": "public",
        "_id": "6765f3b90ae6d11ac2f780fb",
        "createdAt": "2024-12-20T22:46:17.779Z",
        "updatedAt": "2024-12-20T22:46:17.779Z"
      },
      "errors": [],
      "message": "School created successfully"
    }
    ```

#### 2. Get All Schools

- **GET** :`/school/getSchools`
  - **Description**: Fetches a list of schools
  - **Request**:
    Query parameters: `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f3b90ae6d11ac2f780fb",
          "name": "Spring High School",
          "address": "742 Evergreen Terrace, Springfield, IL, 62701",
          "phone": "+1234567890",
          "email": "contact@springhigh.edu",
          "website": "http://www.springfieldhigh.edu",
          "type": "public",
          "createdAt": "2024-12-20T22:46:17.779Z",
          "updatedAt": "2024-12-20T22:46:17.779Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 3. Get School by ID

- **GET** : `/api/school/getSchoolById`
  - **Description**: Fetches a school by ID
  - **Request**:
    Query parameter: `id=6765f3b90ae6d11ac2f780fb`
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765f3b90ae6d11ac2f780fb",
        "name": "Spring High School",
        "address": "742 Evergreen Terrace, Springfield, IL, 62701",
        "phone": "+1234567890",
        "email": "contact@springhigh.edu",
        "website": "http://www.springfieldhigh.edu",
        "type": "public",
        "createdAt": "2024-12-20T22:46:17.779Z",
        "updatedAt": "2024-12-20T22:46:17.779Z"
      },
      "errors": [],
      "message": ""
    }
    ```

#### 4. Search Schools

- **GET** : `/api/school/searchSchool`
  - **Description**: Fetches a list of schools that match the search criteria
  - **Request**:
    Query parameters: `search=high`, `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f3b90ae6d11ac2f780fb",
          "name": "Spring High School",
          "address": "742 Evergreen Terrace, Springfield, IL, 62701",
          "phone": "+1234567890",
          "email": "contact@springhigh.edu",
          "website": "http://www.springfieldhigh.edu",
          "type": "public",
          "createdAt": "2024-12-20T22:46:17.779Z",
          "updatedAt": "2024-12-20T22:46:17.779Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 5. Update School

- **PUT** : `/api/school/updateSchool`
  - **Description**: Updates a school's details
  - **Request**:
    ```json
    {
      "id": "6765f3b90ae6d11ac2f780fb",
      "type": "private"
    }
    ```
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765f3b90ae6d11ac2f780fb",
        "name": "Spring High School",
        "address": "742 Evergreen Terrace, Springfield, IL, 62701",
        "phone": "+1234567890",
        "email": "contact@springhigh.edu",
        "website": "http://www.springfieldhigh.edu",
        "type": "private",
        "createdAt": "2024-12-20T22:46:17.779Z",
        "updatedAt": "2024-12-20T22:50:29.938Z"
      },
      "errors": [],
      "message": "School updated successfully"
    }
    ```

#### 6. Delete School

- **DELETE** : `/api/school/deleteSchool`
  - **Description**: Deletes a school
  - **Request**:
    Path parameter: `id=6765f3b90ae6d11ac2f780fb`
  - **Response**: [`200`, `400`, `401`, `404`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {},
      "errors": [],
      "message": "School deleted successfully"
    }
    ```

---

### Classrooms (managed by superadmins and school admins)

#### Health check

- **HEAD** : `/api/classroom/health`
  - **Description:** A lightweight check to verify the health of the classroom module
  - **Response:** [`200`, `400`, `401`, `403`, `429`, `500`]

#### 1. Create a Classroom

- **POST** : `/api/classroom/createClassroom`

  - **Description**: Creates a new classroom
  - **Request**:

    ```json
    {
      "name": "Class B",
      "schoolId": "6765c77ccc0e9dcc510262f4",
      "capacity": 10,
      "resources": []
    }
    ```

  - **Response**: [`201`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "name": "Class B",
        "capacity": 10,
        "schoolId": "6765c77ccc0e9dcc510262f4",
        "resources": [],
        "_id": "6765f78d92069adbd97b751b",
        "createdAt": "2024-12-20T23:02:37.614Z",
        "updatedAt": "2024-12-20T23:02:37.614Z"
      },
      "errors": [],
      "message": "Classroom created successfully"
    }
    ```

#### 2. Get All Classrooms

- **GET** :`/classroom/getClassrooms`
  - **Description**: Fetches a list of classrooms
  - **Request**:
    Query parameters: `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f78d92069adbd97b751b",
          "name": "Class B",
          "capacity": 10,
          "schoolId": "6765c77ccc0e9dcc510262f4",
          "resources": [],
          "createdAt": "2024-12-20T23:02:37.614Z",
          "updatedAt": "2024-12-20T23:02:37.614Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 3. Get Classroom by ID

- **GET** : `/api/classroom/getClassroomById`
  - **Description**: Fetches a classroom by ID
  - **Request**:
    Query parameter: `id=6765f78d92069adbd97b751b`
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765f78d92069adbd97b751b",
        "name": "Class B",
        "capacity": 10,
        "schoolId": "6765c77ccc0e9dcc510262f4",
        "resources": [],
        "createdAt": "2024-12-20T23:02:37.614Z",
        "updatedAt": "2024-12-20T23:02:37.614Z"
      },
      "errors": [],
      "message": ""
    }
    ```

#### 4. Get Classrooms by School ID

- **GET** : `/api/classroom/getClassroomsBySchoolId`
  - **Description**: Fetches classrooms by school ID
  - **Request**:
    Query parameter: `id=6765c77ccc0e9dcc510262f4`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f78d92069adbd97b751b",
          "name": "Class B",
          "capacity": 10,
          "schoolId": "6765c77ccc0e9dcc510262f4",
          "resources": [],
          "createdAt": "2024-12-20T23:02:37.614Z",
          "updatedAt": "2024-12-20T23:02:37.614Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 5. Search Classrooms

- **GET** : `/api/classroom/searchClassroom`
  - **Description**: Fetches a list of classrooms that match the search criteria
  - **Request**:
    Query parameters: `search=class`, `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f78d92069adbd97b751b",
          "name": "Class B",
          "capacity": 10,
          "schoolId": "6765c77ccc0e9dcc510262f4",
          "resources": [],
          "createdAt": "2024-12-20T23:02:37.614Z",
          "updatedAt": "2024-12-20T23:02:37.614Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 6. Update Classroom

- **PUT** : `/api/classroom/updateClassroom`
  - **Description**: Updates a classroom's details
  - **Request**:
    ```json
    {
      "id": "6765f78d92069adbd97b751b",
      "capacity": 100
    }
    ```
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765f78d92069adbd97b751b",
        "name": "Class B",
        "capacity": 100,
        "schoolId": "6765c77ccc0e9dcc510262f4",
        "resources": [],
        "createdAt": "2024-12-20T23:02:37.614Z",
        "updatedAt": "2024-12-20T23:05:31.556Z"
      },
      "errors": [],
      "message": "Classroom updated successfully"
    }
    ```

#### 7. Delete Classroom

- **DELETE** : `/api/classroom/deleteClassroom`
  - **Description**: Deletes a classroom
  - **Request**:
    Path parameter: `id=6765f78d92069adbd97b751b`
  - **Response**: [`200`, `400`, `401`, `404`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {},
      "errors": [],
      "message": "Classroom deleted successfully"
    }
    ```

---

### Students (managed by superadmins and school admins)

#### Health check

- **HEAD** : `/api/student/health`
  - **Description:** A lightweight check to verify the health of the student module
  - **Response:** [`200`, `400`, `401`, `403`, `429`, `500`]

#### 1. Create a Student

- **POST** : `/api/student/createStudent`

  - **Description**: Creates a new student
  - **Request**:

    ```json
    {
      "firstName": "Oluwaseun",
      "lastName": "Aderinlokun",
      "classroomId": "6765c77ccc0e9dcc510262f4",
      "schoolId": "6765caf4dc1122346ef15eeb",
      "dateOfBirth": "2010-06-06"
    }
    ```

  - **Response**: [`201`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "firstName": "Oluwaseun",
        "lastName": "Aderinlokun",
        "dateOfBirth": "2010-06-06T00:00:00.000Z",
        "schoolId": "6765caf4dc1122346ef15eeb",
        "classroomId": "6765c77ccc0e9dcc510262f4",
        "_id": "6765f93092069adbd97b752c",
        "enrolledAt": "2024-12-20T23:09:36.400Z",
        "createdAt": "2024-12-20T23:09:36.401Z",
        "updatedAt": "2024-12-20T23:09:36.401Z"
      },
      "errors": [],
      "message": "Student created successfully"
    }
    ```

#### 2. Get All Students

- **GET** :`/student/getStudents`
  - **Description**: Fetches a list of students
  - **Request**:
    Query parameters: `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f93092069adbd97b752c",
          "firstName": "Oluwaseun",
          "lastName": "Aderinlokun",
          "dateOfBirth": "2010-06-06T00:00:00.000Z",
          "schoolId": "6765caf4dc1122346ef15eeb",
          "classroomId": "6765c77ccc0e9dcc510262f4",
          "enrolledAt": "2024-12-20T23:09:36.400Z",
          "createdAt": "2024-12-20T23:09:36.401Z",
          "updatedAt": "2024-12-20T23:09:36.401Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 3. Get Student by ID

- **GET** : `/api/student/getStudentById`
  - **Description**: Fetches a student by ID
  - **Request**:
    Query parameter: `id=6765f93092069adbd97b752c`
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765f93092069adbd97b752c",
        "firstName": "Oluwaseun",
        "lastName": "Aderinlokun",
        "dateOfBirth": "2010-06-06T00:00:00.000Z",
        "schoolId": "6765caf4dc1122346ef15eeb",
        "classroomId": "6765c77ccc0e9dcc510262f4",
        "enrolledAt": "2024-12-20T23:09:36.400Z",
        "createdAt": "2024-12-20T23:09:36.401Z",
        "updatedAt": "2024-12-20T23:09:36.401Z"
      },
      "errors": [],
      "message": ""
    }
    ```

#### 4. Get Students by school ID

- **GET** : `/api/student/getStudentsBySchoolId`
  - **Description**: Fetches students by school ID
  - **Request**:
    Query parameter: `school=6765caf4dc1122346ef15eeb`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f93092069adbd97b752c",
          "firstName": "Oluwaseun",
          "lastName": "Aderinlokun",
          "dateOfBirth": "2010-06-06T00:00:00.000Z",
          "schoolId": "6765caf4dc1122346ef15eeb",
          "classroomId": "6765c77ccc0e9dcc510262f4",
          "enrolledAt": "2024-12-20T23:09:36.400Z",
          "createdAt": "2024-12-20T23:09:36.401Z",
          "updatedAt": "2024-12-20T23:09:36.401Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 5. Get Students by classroom ID

- **GET** : `/api/student/getStudentsByClassroomId`
  - **Description**: Fetches students by classroom ID
  - **Request**:
    Query parameter: `classroom=6765c77ccc0e9dcc510262f4`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f93092069adbd97b752c",
          "firstName": "Oluwaseun",
          "lastName": "Aderinlokun",
          "dateOfBirth": "2010-06-06T00:00:00.000Z",
          "schoolId": "6765caf4dc1122346ef15eeb",
          "classroomId": "6765c77ccc0e9dcc510262f4",
          "enrolledAt": "2024-12-20T23:09:36.400Z",
          "createdAt": "2024-12-20T23:09:36.401Z",
          "updatedAt": "2024-12-20T23:09:36.401Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 6. Search Students

- **GET** : `/api/student/searchStudent`
  - **Description**: Fetches a list of students that match the search criteria
  - **Request**:
    Query parameters: `search=Olu`, `page`, `limit`
  - **Response**: [`200`, `400`, `401`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": [
        {
          "_id": "6765f93092069adbd97b752c",
          "firstName": "Oluwaseun",
          "lastName": "Aderinlokun",
          "dateOfBirth": "2010-06-06T00:00:00.000Z",
          "schoolId": "6765caf4dc1122346ef15eeb",
          "classroomId": "6765c77ccc0e9dcc510262f4",
          "enrolledAt": "2024-12-20T23:09:36.400Z",
          "createdAt": "2024-12-20T23:09:36.401Z",
          "updatedAt": "2024-12-20T23:09:36.401Z"
        }
      ],
      "errors": [],
      "message": ""
    }
    ```

#### 7. Update Student

- **PUT** : `/api/student/updateStudent`
  - **Description**: Updates a student's details
  - **Request**:
    ```json
    {
      "id": "6765f93092069adbd97b752c",
      "dateOfBirth": "2015-06-06"
    }
    ```
  - **Response**: [`200`, `400`, `401`, `403`, `404`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {
        "_id": "6765f93092069adbd97b752c",
        "firstName": "Oluwaseun",
        "lastName": "Aderinlokun",
        "dateOfBirth": "2015-06-06T00:00:00.000Z",
        "schoolId": "6765caf4dc1122346ef15eeb",
        "classroomId": "6765c77ccc0e9dcc510262f4",
        "enrolledAt": "2024-12-20T23:09:36.400Z",
        "createdAt": "2024-12-20T23:09:36.401Z",
        "updatedAt": "2024-12-20T23:14:41.607Z"
      },
      "errors": [],
      "message": "Student updated successfully"
    }
    ```

#### 8. Delete Student

- **DELETE** : `/api/student/deleteStudent`
  - **Description**: Deletes a student
  - **Request**:
    Path parameter: `id=6765f93092069adbd97b752c`
  - **Response**: [`200`, `400`, `401`, `404`, `403`, `429`, `500`]
    ```json
    {
      "ok": true,
      "data": {},
      "errors": [],
      "message": "Student deleted successfully"
    }
    ```

---

## Error Codes and Handling

| Code | Description                             |
| ---- | --------------------------------------- |
| 200  | OK - Successful request                 |
| 201  | Created - Resource created successfully |
| 400  | Bad Request - Invalid input             |
| 401  | Unauthorized - Authentication required  |
| 403  | Forbidden - Access denied               |
| 404  | Not Found - Resource not found          |
| 429  | Too Many Requests - Rate limit exceeded |
| 500  | Internal Server Error - Server error    |

---

### Response JSON format

```json
{
  "ok": true,
  "data": {},
  "errors": [],
  "message": ""
}
```

---

## Database Schema Design

Here is the database schema design derived from your Mongoose models for a school management system:

---

### 1. **User**

| Field Name  | Type     | Constraints                         | Description                                |
| ----------- | -------- | ----------------------------------- | ------------------------------------------ |
| `_id`       | ObjectId | Primary Key                         | Unique identifier for each user.           |
| `username`  | String   | Required, Unique                    | Username of the user.                      |
| `email`     | String   | Required, Unique                    | Email address of the user.                 |
| `password`  | String   | Required                            | Encrypted password for authentication.     |
| `role`      | String   | Required, Enum: `superadmin, admin` | Role of the user in the system.            |
| `schoolId`  | ObjectId | Foreign Key -> School.\_id          | The school associated with the admin user. |
| `createdAt` | Date     | Automatically generated             | Date when the user was created.            |
| `updatedAt` | Date     | Automatically generated             | Date when the user was last updated.       |

### 2. **School**

| Field Name  | Type     | Constraints                       | Description                            |
| ----------- | -------- | --------------------------------- | -------------------------------------- |
| `_id`       | ObjectId | Primary Key                       | Unique identifier for each school.     |
| `name`      | String   | Required                          | Name of the school.                    |
| `address`   | String   | Required                          | Address of the school.                 |
| `phone`     | String   | Required                          | Contact number of the school.          |
| `email`     | String   | Required, Unique                  | Official email address of the school.  |
| `website`   | String   | Optional                          | Website URL of the school.             |
| `type`      | String   | Required, Enum: `public, private` | Type of school (public/private).       |
| `createdAt` | Date     | Automatically generated           | Date when the school was created.      |
| `updatedAt` | Date     | Automatically generated           | Date when the school was last updated. |

### 3. **Student**

| Field Name    | Type     | Constraints                   | Description                               |
| ------------- | -------- | ----------------------------- | ----------------------------------------- |
| `_id`         | ObjectId | Primary Key                   | Unique identifier for each student.       |
| `firstName`   | String   | Required                      | First name of the student.                |
| `lastName`    | String   | Required                      | Last name of the student.                 |
| `dateOfBirth` | Date     | Required                      | Date of birth of the student.             |
| `schoolId`    | ObjectId | Foreign Key -> School.\_id    | The school the student belongs to.        |
| `classroomId` | ObjectId | Foreign Key -> Classroom.\_id | The classroom the student is assigned to. |
| `enrolledAt`  | Date     | Default: current date         | Enrollment date of the student.           |
| `createdAt`   | Date     | Automatically generated       | Date when the student was created.        |
| `updatedAt`   | Date     | Automatically generated       | Date when the student was last updated.   |

### 4. **Classroom**

| Field Name  | Type             | Constraints                | Description                                                                 |
| ----------- | ---------------- | -------------------------- | --------------------------------------------------------------------------- |
| `_id`       | ObjectId         | Primary Key                | Unique identifier for each classroom.                                       |
| `name`      | String           | Required                   | Name or label of the classroom.                                             |
| `capacity`  | Number           | Required                   | Maximum number of students allowed.                                         |
| `schoolId`  | ObjectId         | Foreign Key -> School.\_id | The school the classroom belongs to.                                        |
| `resources` | Array of Strings | Optional                   | List of resources available in the classroom (e.g., projector, whiteboard). |
| `createdAt` | Date             | Automatically generated    | Date when the classroom was created.                                        |
| `updatedAt` | Date             | Automatically generated    | Date when the classroom was last updated.                                   |

---

### Relationships

1. **User ↔ School**: A `User` can optionally be linked to a `School` (`schoolId`), especially for `admin` users.
2. **School ↔ Classroom**: Each `Classroom` is linked to a specific `School` through the `schoolId` foreign key.
3. **Classroom ↔ Student**: Each `Student` is linked to a specific `Classroom` through the `classroomId` foreign key.
4. **School ↔ Student**: Each `Student` is linked to a specific `School` through the `schoolId` foreign key.

This design supports multi-tenancy for schools, with role-based access for users, and maps students and classrooms to their respective schools.

---

## Utilities

- Pagination is handled via `page` and `limit` query parameters.
- Passwords are stored securely using hashing (bcrypt).
- Token are generated using JWT - JSON Web Token

---

## API Rate Limiting and Security Measures

To enhance security and performance, the following middleware and techniques have been implemented:

### **1. Rate Limiting**

Rate limiting prevents abuse by limiting the number of requests a client can make within a specified timeframe.

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 100, // Limit each IP to 100 requests per window
});

// Apply to all requests
app.use(limiter);
```

### **2. Helmet**

Helmet helps secure the app by setting various HTTP headers, protecting against common vulnerabilities like clickjacking, cross-site scripting, and more.

```javascript
const helmet = require("helmet");

// Use Helmet middleware
app.use(helmet());
```

### **3. MongoDB Injection Protection**

To prevent NoSQL injection attacks, `express-mongo-sanitize` is used to remove any MongoDB operators from user input.

```javascript
const mongoSanitize = require("express-mongo-sanitize");

// Sanitize user input
app.use(mongoSanitize());
```

### **4. XSS Protection**

`xss-clean` is used to sanitize user input and protect against cross-site scripting (XSS) attacks.

```javascript
const xss = require("xss-clean");

// Sanitize user input to prevent XSS
app.use(xss());
```

### **5. Request Logging**

`morgan` is used for logging HTTP requests to help with monitoring and debugging.

**Implementation Example:**

```javascript
const morgan = require("morgan");

// Use Morgan middleware
app.use(morgan("combined")); // Logs detailed request information
```

---

## Deployment

This guide provides step-by-step instructions to deploy the School Management System backend REST API to **Render**.

---

### **Prerequisites**

1. A [Render](https://render.com/) account (sign up if you don’t have one).
2. A GitHub repository containing backend code.
3. A redis URL connected to a running redis instance.
4. A mongodb connection URI connected to a running mongoDB instance

---

#### 1. **Prepare**

- Verify that the app runs correctly on your local machine:
  ```bash
  npm install
  npm start
  ```
- Push the project to a GitHub repository:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin <your-github-repository-url>
  git push -u origin main
  ```

#### 2. **Set Up Render**

1.  Go to [Render Dashboard](https://dashboard.render.com/).
2.  Click on **New** → **Web Service**.

#### 3. **Connect GitHub Repository**

- Under the **Web Service** setup page:
  1.  Select **Connect account** and authorize Render to access your GitHub repository.
  2.  Choose the repository containing the code.

#### 4. **Configure the Web Service**

- Fill in the required fields:
  - **Name**: Choose a name for your service (e.g., `axion`).
  - **Region**: Choose a region.
  - **Branch**: Select the branch to deploy `main`
- Configure the **Build and Start Commands**:
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
- Select the **Environment** as `Node`.

#### 5. **Add Environment Variables**

- Scroll to the **Environment Variables** section.
- Add the environment variables. e.g.

  ```
  LONG_TOKEN_SECRET=0zsblqAWXpTitbcknJ90v7plpCp6XGexe9WBCjheZxr8aFvWAq
  SHORT_TOKEN_SECRET=cgRVqv0zrj07gz5uB0cgdktLLjJPmXcZFDs4u30Adnk3wQSOKG
  NACL_SECRET=n2ejdLvGtIpDX1Ka4uDHxeZAuK0mE8OPxZLcsVYntgU9LMxRJm
  MONGO_URI=mongodb://127.0.0.1:27017/axion
  REDIS_URI=redis://127.0.0.1:6379
  SUPER_ADMIN_USERNAME=
  SUPER_ADMIN_EMAIL=
  SUPER_ADMIN_PASSWORD=
  ```

#### 6. **Deploy the Service**

- Click **Create Web Service** to start the deployment process.
- Wait for the deployment to complete. The build logs will be visible on the dashboard.

#### 7. **Accessing the API**

- Once deployment is successful, Render will provide a public URL to access the API

---

### **Test**

A 200 response status code indicates a successful deployment

1. Using **curl**:
   ```bash
   curl -X HEAD {{HOST}}/api/user/health
   ```
2. Using **Postman**:

   - `HEAD`: `{{HOST}}/api/user/health`

3. To use other endpoints, seed an initial admin as documented at the beginning of this documentation
