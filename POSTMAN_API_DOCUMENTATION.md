# Postman API Documentation — Placement Management System

Base URL (local development): `http://127.0.0.1:8000/api/`

Import `POSTMAN_COLLECTION.json` into Postman to get all requests below pre-configured.
The collection uses a collection variable `base_url` (default `http://127.0.0.1:8000/api`)
and `token` (filled automatically after you run the **Login** request).

## 1. Authentication

### Login
`POST /auth/login/`
```json
{ "username": "admin", "password": "Admin@12345" }
```
Response:
```json
{ "message": "Login successful", "token": "xxxxxxxx", "username": "admin" }
```
Use the returned token in every subsequent request header:
```
Authorization: Token xxxxxxxx
```

### Logout
`POST /auth/logout/` (requires token header)

## 2. Dashboard & Reports
- `GET /dashboard/stats/` — live counts + placement percentage + recent activity
- `GET /reports/` — department-wise, status-wise, company-wise statistics

## 3. Students
| Method | URL | Description |
|---|---|---|
| POST | /students/ | Create a student |
| GET | /students/ | List all students (supports `?search=`, `?department=`, `?year=`, `?placement_status=`, `?graduation_year=`) |
| GET | /students/{id}/ | Retrieve one student |
| PUT/PATCH | /students/{id}/ | Update a student |
| DELETE | /students/{id}/ | Delete a student |

Sample create body:
```json
{
  "register_number": "REG2026001",
  "full_name": "Arjun Kumar",
  "email": "arjun@example.com",
  "phone_number": "9876543210",
  "department": "CSE",
  "year": "3",
  "cgpa": "8.75",
  "skills": "Python, React, SQL",
  "graduation_year": 2027,
  "placement_status": "NOT_PLACED",
  "company_name": "",
  "package": "0"
}
```

## 4. Companies
| Method | URL |
|---|---|
| POST | /companies/ |
| GET | /companies/ (supports `?search=`) |
| GET | /companies/{id}/ |
| PUT/PATCH | /companies/{id}/ |
| DELETE | /companies/{id}/ |

Sample create body:
```json
{
  "company_name": "Zoho Corporation",
  "industry": "Product",
  "location": "Chennai",
  "job_role": "Software Developer",
  "minimum_cgpa": "7.5",
  "package": "700000",
  "job_type": "FULL_TIME",
  "drive_date": "2026-11-15",
  "number_of_vacancies": 15,
  "eligibility": "CSE, IT, ECE",
  "description": "On-campus drive for final year students."
}
```

## 5. Placement Applications
| Method | URL |
|---|---|
| POST | /applications/ |
| GET | /applications/ (supports `?company=`, `?student=`, `?application_status=`) |
| GET | /applications/{id}/ |
| PUT/PATCH | /applications/{id}/ |
| DELETE | /applications/{id}/ |

Sample create body:
```json
{
  "student": 1,
  "company": 1,
  "application_date": "2026-09-01",
  "job_role": "Software Developer",
  "application_status": "APPLIED"
}
```

## 6. Placement Records
| Method | URL |
|---|---|
| POST | /placements/ |
| GET | /placements/ |
| GET | /placements/{id}/ |
| PUT/PATCH | /placements/{id}/ |
| DELETE | /placements/{id}/ |

Sample create body:
```json
{
  "student": 1,
  "company": 1,
  "job_role": "Software Developer",
  "package": "700000",
  "placement_date": "2026-12-01",
  "placement_type": "FULL_TIME",
  "status": "CONFIRMED"
}
```

## Response Format
- Successful create/update: `{ "message": "...", "data": {...} }`
- Successful delete: `{ "message": "... deleted successfully" }`
- Validation error: `{ "error": "Invalid data.", "details": { "field": ["reason"] } }`
- Not found: `{ "error": "Not found." }`
