from django.urls import path
from . import views

urlpatterns = [
    path('', views.teams_test, name='teams_test'),
]