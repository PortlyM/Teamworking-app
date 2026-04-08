from django.urls import path
from . import views
from apps.tasks.views import TaskDetailView

urlpatterns = [
    path('<int:pk>/', TaskDetailView.as_view(), name='task_detail'),
]