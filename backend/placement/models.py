from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.db import models


class Student(models.Model):
    YEAR_CHOICES = [('1', '1st Year'), ('2', '2nd Year'), ('3', '3rd Year'), ('4', '4th Year')]
    STATUS_CHOICES = [
        ('NOT_PLACED', 'Not Placed'),
        ('APPLIED', 'Applied'),
        ('SHORTLISTED', 'Shortlisted'),
        ('SELECTED', 'Selected'),
    ]

    register_number = models.CharField(max_length=30, unique=True)
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?\d{10,15}$', 'Enter a valid phone number (10-15 digits).')]
    )
    department = models.CharField(max_length=100)
    year = models.CharField(max_length=1, choices=YEAR_CHOICES)
    cgpa = models.DecimalField(
        max_digits=4, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    skills = models.CharField(max_length=500, blank=True, default='')
    graduation_year = models.PositiveIntegerField()
    placement_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NOT_PLACED')
    company_name = models.CharField(max_length=150, blank=True, default='')
    package = models.DecimalField(
        max_digits=10, decimal_places=2, default=0,
        validators=[MinValueValidator(0)]
    )
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return f"{self.full_name} ({self.register_number})"


class Company(models.Model):
    JOB_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('INTERNSHIP', 'Internship'),
        ('INTERNSHIP_FULL_TIME', 'Internship + Full Time'),
    ]

    company_name = models.CharField(max_length=150)
    industry = models.CharField(max_length=100)
    location = models.CharField(max_length=150)
    job_role = models.CharField(max_length=150)
    minimum_cgpa = models.DecimalField(
        max_digits=4, decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(10)]
    )
    package = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    job_type = models.CharField(max_length=25, choices=JOB_TYPE_CHOICES, default='FULL_TIME')
    drive_date = models.DateField()
    number_of_vacancies = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    eligibility = models.CharField(max_length=300, blank=True, default='')
    description = models.TextField(blank=True, default='')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_date']
        verbose_name_plural = 'Companies'

    def __str__(self):
        return self.company_name


class PlacementApplication(models.Model):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('SHORTLISTED', 'Shortlisted'),
        ('INTERVIEW_SCHEDULED', 'Interview Scheduled'),
        ('SELECTED', 'Selected'),
        ('REJECTED', 'Rejected'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='applications')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='applications')
    application_date = models.DateField()
    job_role = models.CharField(max_length=150)
    application_status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='APPLIED')
    interview_date = models.DateField(null=True, blank=True)
    result = models.CharField(max_length=200, blank=True, default='')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_date']
        unique_together = ('student', 'company', 'job_role')

    def __str__(self):
        return f"{self.student.full_name} -> {self.company.company_name}"


class PlacementRecord(models.Model):
    TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'),
        ('INTERNSHIP', 'Internship'),
        ('INTERNSHIP_FULL_TIME', 'Internship + Full Time'),
    ]
    STATUS_CHOICES = [
        ('CONFIRMED', 'Confirmed'),
        ('PENDING', 'Pending'),
        ('CANCELLED', 'Cancelled'),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='placement_records')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='placement_records')
    job_role = models.CharField(max_length=150)
    package = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    placement_date = models.DateField()
    placement_type = models.CharField(max_length=25, choices=TYPE_CHOICES, default='FULL_TIME')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='CONFIRMED')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return f"{self.student.full_name} placed at {self.company.company_name}"
