# attractions/views.py
from rest_framework import generics
from .models import Attraction
from .serializers import AttractionSerializer

class AttractionList(generics.ListAPIView):
    """
    Widok zwracający listę wszystkich atrakcji w formacie GeoJSON.
    """
    queryset = Attraction.objects.all()
    serializer_class = AttractionSerializer