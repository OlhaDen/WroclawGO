# attractions/urls.py
from django.urls import path
from .views import AttractionList

urlpatterns = [
    path('api/attractions/', AttractionList.as_view(), name='attraction-list'),
]