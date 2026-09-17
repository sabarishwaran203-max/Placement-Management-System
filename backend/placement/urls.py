from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'students', views.StudentViewSet, basename='student')
router.register(r'companies', views.CompanyViewSet, basename='company')
router.register(r'applications', views.PlacementApplicationViewSet, basename='application')
router.register(r'placements', views.PlacementRecordViewSet, basename='placement')

urlpatterns = [
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
    path('reports/', views.reports_view, name='reports'),
    path('', include(router.urls)),
]
