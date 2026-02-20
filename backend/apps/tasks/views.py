from django.shortcuts import render
from django.http import HttpResponse

def tasks_test(request):
    return HttpResponse('tasks test')