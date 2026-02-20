from django.shortcuts import render
from django.http import HttpResponse

def users_test(request):
    return HttpResponse('users test')