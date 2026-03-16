# backend/seed_wroclaw.py
import os
import django

# Konfiguracja Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from attractions.models import Attraction
from django.contrib.gis.geos import Point

def seed():
    data = [
        {"name": "Panorama Racławicka", "lat": 51.1107, "lng": 17.0444, "cat": "Muzeum"},
        {"name": "Zoo Wrocław & Afrykarium", "lat": 51.1052, "lng": 17.0753, "cat": "Natura"},
        {"name": "Hala Stulecia", "lat": 51.1069, "lng": 17.0768, "cat": "Zabytek"},
        {"name": "Rynek (Ratusz)", "lat": 51.1095, "lng": 17.0328, "cat": "Kultura"},
    ]

    for item in data:
        # Tworzymy punkt (longitude, latitude)
        pnt = Point(item['lng'], item['lat'])
        Attraction.objects.get_or_create(
            name=item['name'],
            defaults={'location': pnt, 'category': item['cat'], 'description': 'Super miejsce!'}
        )


if __name__ == '__main__':
    seed()