from rest_framework import serializers
from .models import Student, Company, PlacementApplication, PlacementRecord


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def validate_register_number(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Register number cannot be empty.")
        qs = Student.objects.filter(register_number__iexact=value.strip())
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("Register number already exists.")
        return value.strip()

    def validate_email(self, value):
        qs = Student.objects.filter(email__iexact=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A student with this email already exists.")
        return value

    def validate_full_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value

    def validate_cgpa(self, value):
        if value < 0 or value > 10:
            raise serializers.ValidationError("CGPA must be between 0 and 10.")
        return value

    def validate_package(self, value):
        if value < 0:
            raise serializers.ValidationError("Package cannot be negative.")
        return value


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

    def validate_company_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Company name is required.")
        return value.strip()

    def validate_job_role(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Job role is required.")
        return value.strip()

    def validate_minimum_cgpa(self, value):
        if value < 0 or value > 10:
            raise serializers.ValidationError("Minimum CGPA must be between 0 and 10.")
        return value

    def validate_package(self, value):
        if value < 0:
            raise serializers.ValidationError("Package must not be negative.")
        return value

    def validate_number_of_vacancies(self, value):
        if value <= 0:
            raise serializers.ValidationError("Number of vacancies must be positive.")
        return value


class PlacementApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    company_name = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = PlacementApplication
        fields = '__all__'

    def validate(self, attrs):
        if not attrs.get('student') and not (self.instance and self.instance.student):
            raise serializers.ValidationError({"student": "Student is required."})
        if not attrs.get('company') and not (self.instance and self.instance.company):
            raise serializers.ValidationError({"company": "Company is required."})
        return attrs


class PlacementRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)
    company_name = serializers.CharField(source='company.company_name', read_only=True)

    class Meta:
        model = PlacementRecord
        fields = '__all__'

    def validate_package(self, value):
        if value < 0:
            raise serializers.ValidationError("Package cannot be negative.")
        return value
