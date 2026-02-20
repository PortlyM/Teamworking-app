from django.shortcuts import render
from django.http import HttpResponse

def teams_test(request):
    return HttpResponse('teams test')