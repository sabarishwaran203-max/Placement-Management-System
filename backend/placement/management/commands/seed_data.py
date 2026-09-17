import random
from datetime import date, timedelta
from decouple import config
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from placement.models import Student, Company, PlacementApplication, PlacementRecord


class Command(BaseCommand):
    help = "Seed the database with demo/sample data for the Placement Management System."

    def handle(self, *args, **options):
        admin_username = config('DEMO_ADMIN_USERNAME', default='admin')
        admin_password = config('DEMO_ADMIN_PASSWORD', default='Admin@12345')

        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(admin_username, 'admin@example.com', admin_password)
            self.stdout.write(self.style.SUCCESS(f"Created demo admin user '{admin_username}'"))
        else:
            self.stdout.write("Demo admin user already exists, skipping.")

        departments = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']
        companies_data = [
            ("TCS", "IT Services", "Chennai", "Software Trainee", 6.0, 350000, "FULL_TIME", 40),
            ("Infosys", "IT Services", "Bangalore", "Systems Engineer", 6.5, 400000, "FULL_TIME", 35),
            ("Zoho", "Product", "Chennai", "Software Developer", 7.5, 700000, "FULL_TIME", 15),
            ("Amazon", "E-commerce", "Hyderabad", "SDE-1", 8.0, 2200000, "FULL_TIME", 5),
            ("Wipro", "IT Services", "Pune", "Project Engineer", 6.0, 380000, "INTERNSHIP_FULL_TIME", 25),
        ]

        companies = []
        for name, industry, location, role, min_cgpa, pkg, job_type, vac in companies_data:
            company, _ = Company.objects.get_or_create(
                company_name=name,
                defaults=dict(
                    industry=industry, location=location, job_role=role,
                    minimum_cgpa=min_cgpa, package=pkg, job_type=job_type,
                    drive_date=date.today() + timedelta(days=random.randint(10, 60)),
                    number_of_vacancies=vac,
                    eligibility=f"Minimum CGPA {min_cgpa}, no active backlogs",
                    description=f"[SAMPLE DATA] Campus drive for {role} at {name}."
                )
            )
            companies.append(company)

        first_names = ["Arjun", "Priya", "Karthik", "Divya", "Rahul", "Sneha", "Vikram", "Anitha", "Suresh", "Meena"]
        last_names = ["Kumar", "Raj", "Sharma", "Iyer", "Nair", "Reddy", "Pillai", "Menon"]
        statuses = ['NOT_PLACED', 'APPLIED', 'SHORTLISTED', 'SELECTED']

        students = []
        for i in range(1, 21):
            reg_no = f"SAMPLE{2023000 + i}"
            if Student.objects.filter(register_number=reg_no).exists():
                students.append(Student.objects.get(register_number=reg_no))
                continue
            name = f"{random.choice(first_names)} {random.choice(last_names)}"
            status_choice = random.choice(statuses)
            student = Student.objects.create(
                register_number=reg_no,
                full_name=name,
                email=f"sample.student{i}@example.com",
                phone_number=f"9{random.randint(100000000, 999999999)}",
                department=random.choice(departments),
                year=str(random.randint(3, 4)),
                cgpa=round(random.uniform(6.0, 9.5), 2),
                skills="Python, Java, Communication",
                graduation_year=2026,
                placement_status=status_choice,
                company_name=random.choice(companies).company_name if status_choice == 'SELECTED' else '',
                package=random.choice([350000, 400000, 600000]) if status_choice == 'SELECTED' else 0,
            )
            students.append(student)

        for student in students:
            if student.placement_status in ('APPLIED', 'SHORTLISTED', 'SELECTED'):
                company = random.choice(companies)
                PlacementApplication.objects.get_or_create(
                    student=student, company=company, job_role=company.job_role,
                    defaults=dict(
                        application_date=date.today() - timedelta(days=random.randint(1, 30)),
                        application_status='SELECTED' if student.placement_status == 'SELECTED' else 'APPLIED',
                    )
                )
            if student.placement_status == 'SELECTED':
                company = companies[0]
                PlacementRecord.objects.get_or_create(
                    student=student, company=company,
                    defaults=dict(
                        job_role=company.job_role,
                        package=student.package or company.package,
                        placement_date=date.today() - timedelta(days=random.randint(1, 10)),
                        placement_type='FULL_TIME',
                        status='CONFIRMED',
                    )
                )

        self.stdout.write(self.style.SUCCESS(
            "Sample data seeded successfully! (All demo records are prefixed with 'SAMPLE')."
        ))
        self.stdout.write(self.style.WARNING(
            f"Demo login -> username: '{admin_username}'  password: '{admin_password}'"
        ))
