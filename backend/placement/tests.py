from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework import status

from .models import Student, Company, PlacementApplication, PlacementRecord


class BaseAuthTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin', password='TestPass123')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')


class StudentTests(BaseAuthTestCase):
    def setUp(self):
        super().setUp()
        self.student_data = {
            "register_number": "REG001",
            "full_name": "John Doe",
            "email": "john@example.com",
            "phone_number": "9876543210",
            "department": "CSE",
            "year": "3",
            "cgpa": "8.50",
            "skills": "Python, React",
            "graduation_year": 2026,
            "placement_status": "NOT_PLACED",
            "package": "0",
        }

    def test_create_student(self):
        response = self.client.post('/api/students/', self.student_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 1)

    def test_get_students(self):
        Student.objects.create(**{**self.student_data, 'cgpa': 8.5})
        response = self.client.get('/api/students/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_student(self):
        student = Student.objects.create(**{**self.student_data, 'cgpa': 8.5})
        response = self.client.patch(f'/api/students/{student.id}/', {"full_name": "Jane Doe"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        student.refresh_from_db()
        self.assertEqual(student.full_name, "Jane Doe")

    def test_delete_student(self):
        student = Student.objects.create(**{**self.student_data, 'cgpa': 8.5})
        response = self.client.delete(f'/api/students/{student.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Student.objects.count(), 0)

    def test_duplicate_register_number(self):
        Student.objects.create(**{**self.student_data, 'cgpa': 8.5})
        dup = {**self.student_data, 'email': 'other@example.com'}
        response = self.client.post('/api/students/', dup, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_student_id(self):
        response = self.client.get('/api/students/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_cgpa(self):
        bad = {**self.student_data, 'cgpa': '15', 'register_number': 'REG999', 'email': 'x@example.com'}
        response = self.client.post('/api/students/', bad, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CompanyTests(BaseAuthTestCase):
    def test_create_company(self):
        data = {
            "company_name": "TechCorp", "industry": "IT", "location": "Chennai",
            "job_role": "Software Engineer", "minimum_cgpa": "7.0", "package": "600000",
            "job_type": "FULL_TIME", "drive_date": "2026-10-01", "number_of_vacancies": 10,
            "eligibility": "CSE, IT", "description": "Great company"
        }
        response = self.client.post('/api/companies/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Company.objects.count(), 1)

    def test_invalid_company_id(self):
        response = self.client.get('/api/companies/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ApplicationAndPlacementTests(BaseAuthTestCase):
    def setUp(self):
        super().setUp()
        self.student = Student.objects.create(
            register_number="REG100", full_name="Alice", email="alice@example.com",
            phone_number="9876500000", department="ECE", year="4", cgpa=9.0,
            graduation_year=2026,
        )
        self.company = Company.objects.create(
            company_name="Acme", industry="IT", location="Bangalore", job_role="Developer",
            minimum_cgpa=7.5, package=800000, drive_date="2026-11-01", number_of_vacancies=5,
        )

    def test_create_application(self):
        data = {
            "student": self.student.id, "company": self.company.id,
            "application_date": "2026-09-01", "job_role": "Developer",
            "application_status": "APPLIED",
        }
        response = self.client.post('/api/applications/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PlacementApplication.objects.count(), 1)

    def test_create_placement(self):
        data = {
            "student": self.student.id, "company": self.company.id,
            "job_role": "Developer", "package": "800000",
            "placement_date": "2026-12-01", "placement_type": "FULL_TIME", "status": "CONFIRMED",
        }
        response = self.client.post('/api/placements/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PlacementRecord.objects.count(), 1)
