from django.db.models import Q, Avg, Max, Count
from django.contrib.auth import authenticate
from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import exception_handler

from .models import Student, Company, PlacementApplication, PlacementRecord
from .serializers import (
    StudentSerializer, CompanySerializer,
    PlacementApplicationSerializer, PlacementRecordSerializer,
)


def custom_exception_handler(exc, context):
    """Return clean, meaningful error responses for any unhandled exception."""
    response = exception_handler(exc, context)
    if response is None:
        return Response(
            {"error": "An unexpected server error occurred. Please try again."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
    if isinstance(response.data, dict) and 'detail' in response.data and len(response.data) == 1:
        response.data = {"error": str(response.data['detail'])}
    return response


# ---------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')
    if not username or not password:
        return Response({"error": "Username and password are required."}, status=400)
    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid username or password."}, status=401)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({
        "message": "Login successful",
        "token": token.key,
        "username": user.username,
    })


@api_view(['POST'])
def logout_view(request):
    try:
        request.user.auth_token.delete()
    except Exception:
        pass
    return Response({"message": "Logged out successfully"})


# ---------------------------------------------------------------------
# Dashboard / Reports
# ---------------------------------------------------------------------
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    total_students = Student.objects.count()
    total_companies = Company.objects.count()
    total_applications = PlacementApplication.objects.count()
    placed = Student.objects.filter(placement_status='SELECTED').count()
    shortlisted = Student.objects.filter(placement_status='SHORTLISTED').count()
    not_placed = Student.objects.filter(placement_status='NOT_PLACED').count()
    applied = Student.objects.filter(placement_status='APPLIED').count()
    percentage = round((placed / total_students) * 100, 2) if total_students else 0

    recent_placements = PlacementRecord.objects.select_related('student', 'company').order_by('-created_date')[:5]
    recent_data = [{
        "student_name": r.student.full_name,
        "company_name": r.company.company_name,
        "package": str(r.package),
        "placement_date": r.placement_date,
    } for r in recent_placements]

    return Response({
        "total_students": total_students,
        "total_companies": total_companies,
        "total_applications": total_applications,
        "students_placed": placed,
        "students_shortlisted": shortlisted,
        "students_applied": applied,
        "students_not_placed": not_placed,
        "placement_percentage": percentage,
        "recent_activity": recent_data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def reports_view(request):
    dept_stats = list(
        Student.objects.values('department')
        .annotate(total=Count('id'), placed=Count('id', filter=Q(placement_status='SELECTED')))
        .order_by('department')
    )
    status_stats = list(
        Student.objects.values('placement_status').annotate(total=Count('id'))
    )
    company_wise = list(
        PlacementRecord.objects.values('company__company_name')
        .annotate(total_placed=Count('id'), avg_package=Avg('package'))
        .order_by('-total_placed')
    )
    agg = PlacementRecord.objects.aggregate(
        avg_package=Avg('package'), highest_package=Max('package'), total_placed=Count('id')
    )
    return Response({
        "department_wise": dept_stats,
        "status_wise": status_stats,
        "company_wise": company_wise,
        "average_package": agg['avg_package'] or 0,
        "highest_package": agg['highest_package'] or 0,
        "total_placed_students": agg['total_placed'] or 0,
    })


# ---------------------------------------------------------------------
# ViewSets
# ---------------------------------------------------------------------
class BaseModelViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": "Invalid data.", "details": serializer.errors}, status=400)
        self.perform_create(serializer)
        return Response({"message": f"{self.entity_name} created successfully", "data": serializer.data}, status=201)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            return Response({"error": "Invalid data.", "details": serializer.errors}, status=400)
        self.perform_update(serializer)
        return Response({"message": f"{self.entity_name} updated successfully", "data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({"message": f"{self.entity_name} deleted successfully"}, status=200)


class StudentViewSet(BaseModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    entity_name = "Student"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'register_number', 'department', 'email']

    def get_queryset(self):
        qs = Student.objects.all()
        params = self.request.query_params
        department = params.get('department')
        year = params.get('year')
        placement_status = params.get('placement_status')
        graduation_year = params.get('graduation_year')
        search = params.get('search')

        if department:
            qs = qs.filter(department__iexact=department)
        if year:
            qs = qs.filter(year=year)
        if placement_status:
            qs = qs.filter(placement_status=placement_status)
        if graduation_year:
            qs = qs.filter(graduation_year=graduation_year)
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search) | Q(register_number__icontains=search) |
                Q(department__icontains=search) | Q(email__icontains=search)
            )
        return qs


class CompanyViewSet(BaseModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    entity_name = "Company"
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'industry', 'location', 'job_role']

    def get_queryset(self):
        qs = Company.objects.all()
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                Q(company_name__icontains=search) | Q(industry__icontains=search) |
                Q(location__icontains=search) | Q(job_role__icontains=search)
            )
        return qs


class PlacementApplicationViewSet(BaseModelViewSet):
    queryset = PlacementApplication.objects.select_related('student', 'company').all()
    serializer_class = PlacementApplicationSerializer
    entity_name = "Application"

    def get_queryset(self):
        qs = PlacementApplication.objects.select_related('student', 'company').all()
        params = self.request.query_params
        company_id = params.get('company')
        student_id = params.get('student')
        app_status = params.get('application_status')
        if company_id:
            qs = qs.filter(company_id=company_id)
        if student_id:
            qs = qs.filter(student_id=student_id)
        if app_status:
            qs = qs.filter(application_status=app_status)
        return qs


class PlacementRecordViewSet(BaseModelViewSet):
    queryset = PlacementRecord.objects.select_related('student', 'company').all()
    serializer_class = PlacementRecordSerializer
    entity_name = "Placement record"
