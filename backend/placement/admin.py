from django.contrib import admin
from .models import Student, Company, PlacementApplication, PlacementRecord


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('register_number', 'full_name', 'department', 'year', 'cgpa', 'placement_status', 'company_name')
    search_fields = ('full_name', 'register_number', 'email', 'department')
    list_filter = ('department', 'year', 'placement_status', 'graduation_year')


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'industry', 'location', 'job_role', 'package', 'drive_date')
    search_fields = ('company_name', 'industry', 'location', 'job_role')
    list_filter = ('industry', 'job_type')


@admin.register(PlacementApplication)
class PlacementApplicationAdmin(admin.ModelAdmin):
    list_display = ('student', 'company', 'job_role', 'application_status', 'application_date')
    search_fields = ('student__full_name', 'company__company_name', 'job_role')
    list_filter = ('application_status',)


@admin.register(PlacementRecord)
class PlacementRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'company', 'job_role', 'package', 'placement_date', 'placement_type', 'status')
    search_fields = ('student__full_name', 'company__company_name')
    list_filter = ('placement_type', 'status')
