from django.urls import path
from . import views

urlpatterns = [
    path('', views.tasks_test, name='tasks_test'),
]