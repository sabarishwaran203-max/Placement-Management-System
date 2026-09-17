import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company_name', models.CharField(max_length=150)),
                ('industry', models.CharField(max_length=100)),
                ('location', models.CharField(max_length=150)),
                ('job_role', models.CharField(max_length=150)),
                ('minimum_cgpa', models.DecimalField(decimal_places=2, max_digits=4, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)])),
                ('package', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('job_type', models.CharField(choices=[('FULL_TIME', 'Full Time'), ('INTERNSHIP', 'Internship'), ('INTERNSHIP_FULL_TIME', 'Internship + Full Time')], default='FULL_TIME', max_length=25)),
                ('drive_date', models.DateField()),
                ('number_of_vacancies', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('eligibility', models.CharField(blank=True, default='', max_length=300)),
                ('description', models.TextField(blank=True, default='')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Companies',
                'ordering': ['-created_date'],
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('register_number', models.CharField(max_length=30, unique=True)),
                ('full_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=15, validators=[django.core.validators.RegexValidator('^\\+?\\d{10,15}$', 'Enter a valid phone number (10-15 digits).')])),
                ('department', models.CharField(max_length=100)),
                ('year', models.CharField(choices=[('1', '1st Year'), ('2', '2nd Year'), ('3', '3rd Year'), ('4', '4th Year')], max_length=1)),
                ('cgpa', models.DecimalField(decimal_places=2, max_digits=4, validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(10)])),
                ('skills', models.CharField(blank=True, default='', max_length=500)),
                ('graduation_year', models.PositiveIntegerField()),
                ('placement_status', models.CharField(choices=[('NOT_PLACED', 'Not Placed'), ('APPLIED', 'Applied'), ('SHORTLISTED', 'Shortlisted'), ('SELECTED', 'Selected')], default='NOT_PLACED', max_length=20)),
                ('company_name', models.CharField(blank=True, default='', max_length=150)),
                ('package', models.DecimalField(decimal_places=2, default=0, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('created_date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_date'],
            },
        ),
        migrations.CreateModel(
            name='PlacementRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_role', models.CharField(max_length=150)),
                ('package', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('placement_date', models.DateField()),
                ('placement_type', models.CharField(choices=[('FULL_TIME', 'Full Time'), ('INTERNSHIP', 'Internship'), ('INTERNSHIP_FULL_TIME', 'Internship + Full Time')], default='FULL_TIME', max_length=25)),
                ('status', models.CharField(choices=[('CONFIRMED', 'Confirmed'), ('PENDING', 'Pending'), ('CANCELLED', 'Cancelled')], default='CONFIRMED', max_length=15)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='placement_records', to='placement.company')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='placement_records', to='placement.student')),
            ],
            options={
                'ordering': ['-created_date'],
            },
        ),
        migrations.CreateModel(
            name='PlacementApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('application_date', models.DateField()),
                ('job_role', models.CharField(max_length=150)),
                ('application_status', models.CharField(choices=[('APPLIED', 'Applied'), ('SHORTLISTED', 'Shortlisted'), ('INTERVIEW_SCHEDULED', 'Interview Scheduled'), ('SELECTED', 'Selected'), ('REJECTED', 'Rejected')], default='APPLIED', max_length=25)),
                ('interview_date', models.DateField(blank=True, null=True)),
                ('result', models.CharField(blank=True, default='', max_length=200)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='placement.company')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='applications', to='placement.student')),
            ],
            options={
                'ordering': ['-created_date'],
                'unique_together': {('student', 'company', 'job_role')},
            },
        ),
    ]
