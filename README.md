# 🎯 Placement Management System

A complete full-stack **CRUD-based web application** for managing college placement
activities — built as an academic engineering project.

---

## 1. Project Overview

The Placement Management System helps a college Placement Cell manage:
- Student placement records
- Company / recruiter information
- Placement applications
- Final placement records

It demonstrates a full **Frontend → REST API → Backend → Database** flow.

---

## 2. Features

- Admin login (token-based authentication)
- Dashboard with live statistics (auto-calculated from the database)
- Full CRUD for Students, Companies, Applications, and Placement Records
- Search and multi-field filtering
- Frontend **and** backend validation
- Meaningful success / error messages
- Reports page (department-wise, company-wise, status-wise statistics)
- Responsive UI (desktop, tablet, mobile)
- Django Admin panel
- REST API tested via Postman (collection included)
- Sample/demo data seeding
- Environment-variable based configuration (no hard-coded secrets)

---

## 3. Technology Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React, React Router, Axios, HTML, CSS (Vite) |
| Backend   | Python, Django, Django REST Framework |
| Database  | MySQL (via Django ORM) |
| API Testing | Postman |
| Dev Tools | VS Code, Python virtual environment |

---

## 4. System Architecture

```
User
  ↓
React Frontend
  ↓
Axios
  ↓
Django REST API
  ↓
Django Business Logic
  ↓
Django ORM
  ↓
MySQL Database
```

---

## 5. Folder Structure

```
PlacementManagementSystem/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── config/                # Django project settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── placement/             # Django app (models, serializers, views...)
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
│       ├── admin.py
│       ├── tests.py
│       └── management/commands/seed_data.py
│
├── frontend/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── components/        # Sidebar, Header, Notification, ConfirmDialog
│       ├── pages/             # All 17 pages
│       ├── services/api.js    # Centralized Axios API client
│       ├── styles/index.css
│       ├── App.jsx
│       └── main.jsx
│
├── README.md
├── .gitignore
├── POSTMAN_COLLECTION.json
└── POSTMAN_API_DOCUMENTATION.md
```

---

## 6. Prerequisites

Install these before you start:
- **Python 3.10+** — https://www.python.org/downloads/
- **Node.js 18+** and npm — https://nodejs.org/
- **MySQL Server 8+** — https://dev.mysql.com/downloads/installer/
- **VS Code** (recommended) — https://code.visualstudio.com/

---

## 7. MySQL Setup

1. Open MySQL command line / MySQL Workbench and run:

```sql
CREATE DATABASE placement_db;
```

2. Note your MySQL username/password (default user is usually `root`).

> **Quick test without MySQL:** if you just want to try the app quickly, you can
> temporarily use SQLite instead — set `DB_ENGINE=sqlite` in `backend/.env`.
> For your final submission, switch back to MySQL as required by the project spec.

---

## 8. Backend Setup (Windows Commands)

Open a terminal in the `backend` folder:

```bat
cd PlacementManagementSystem\backend
```

### 8.1 Create and activate a virtual environment

```bat
python -m venv venv
venv\Scripts\activate
```

### 8.2 Install dependencies

```bat
pip install -r requirements.txt
```

### 8.3 Configure environment variables

Copy `.env.example` to `.env`:

```bat
copy .env.example .env
```

Open `.env` and set your real MySQL password and a random `SECRET_KEY`.

### 8.4 Run migrations

```bat
python manage.py migrate
```

### 8.5 Create a superuser (for Django Admin)

```bat
python manage.py createsuperuser
```

### 8.6 (Optional) Seed sample/demo data + demo admin login

```bat
python manage.py seed_data
```
This creates ~20 sample students, 5 sample companies, sample applications and
placement records (all clearly marked "SAMPLE"), plus a demo admin user using
the `DEMO_ADMIN_USERNAME` / `DEMO_ADMIN_PASSWORD` values from your `.env`.

### 8.7 Start the Django server

```bat
python manage.py runserver
```

Backend runs at: **http://127.0.0.1:8000/**
Django Admin: **http://127.0.0.1:8000/admin/**

---

## 9. Frontend Setup (Windows Commands)

Open a **new** terminal in the `frontend` folder:

```bat
cd PlacementManagementSystem\frontend
copy .env.example .env
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173/**

Open that URL in your browser and log in using the admin credentials you created
(or the demo credentials from `seed_data`).

---

## 10. API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

| Resource | Endpoints |
|---|---|
| Auth | `POST /auth/login/`, `POST /auth/logout/` |
| Dashboard | `GET /dashboard/stats/` |
| Reports | `GET /reports/` |
| Students | `POST/GET /students/`, `GET/PUT/PATCH/DELETE /students/{id}/` |
| Companies | `POST/GET /companies/`, `GET/PUT/PATCH/DELETE /companies/{id}/` |
| Applications | `POST/GET /applications/`, `GET/PUT/PATCH/DELETE /applications/{id}/` |
| Placements | `POST/GET /placements/`, `GET/PUT/PATCH/DELETE /placements/{id}/` |

See `POSTMAN_API_DOCUMENTATION.md` for full request/response examples.

---

## 11. Postman Testing

1. Open Postman → Import → select `POSTMAN_COLLECTION.json`.
2. Run **Auth - Login** first (it auto-saves the token to a collection variable).
3. Run any other request — the token is attached automatically.

---

## 12. Demo Login

After running `python manage.py seed_data`, log in with the credentials you set
as `DEMO_ADMIN_USERNAME` / `DEMO_ADMIN_PASSWORD` in your `.env` file
(defaults: `admin` / `Admin@12345` — **change these before any real deployment**).

---

## 13. Running Backend Tests

```bat
cd backend
venv\Scripts\activate
python manage.py test
```

Tests cover: student/company/application/placement creation, retrieval, update,
deletion, duplicate register numbers, invalid CGPA, and invalid IDs.

---

## 14. Troubleshooting

| Problem | Solution |
|---|---|
| `django.db.utils.OperationalError` (MySQL) | Check `.env` DB credentials and that MySQL service is running |
| `mysqlclient` fails to install on Windows | Install "Microsoft C++ Build Tools", or use `pip install mysqlclient --only-binary :all:` |
| CORS error in browser console | Confirm `FRONTEND_URL` in backend `.env` matches your Vite dev URL |
| 401 Unauthorized on API calls | Log in again from the frontend to refresh your token |
| Frontend can't reach backend | Confirm Django server is running on port 8000 and `VITE_API_URL` is correct |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, then retry |

---

## 15. Future Enhancements

- Role-based access (Admin vs Placement Officer vs Student login)
- Email notifications for shortlisting/selection
- Resume upload and storage
- Export reports to PDF/Excel
- Charts/graphs on the Reports page
- Pagination for very large student lists

---

## 16. Security Notes

- No passwords or secret keys are hard-coded — all sensitive config lives in `.env`
  (excluded from version control via `.gitignore`).
- Passwords are hashed using Django's built-in password hashing.
- All API endpoints use Django REST Framework serializers for input validation.
- Django ORM is used throughout — no raw SQL, so no SQL-injection risk.
- CORS is explicitly restricted to the configured frontend origin.

---

Built as an academic CRUD-based full-stack project. Good luck with your viva! 🎓
