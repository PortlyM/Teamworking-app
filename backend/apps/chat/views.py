from django.shortcuts import render
from django.http import HttpResponse

def chat_test(request):
    return HttpResponse('chat test')