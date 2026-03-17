# backend/seed_wroclaw.py
import os
import django
import pandas as pd

# Konfiguracja Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from attractions.models import Attraction
from django.contrib.gis.geos import Point

def read_data(filename, category):
    data = []
    df = pd.read_csv(filename)
    for _, row in df.iterrows():
        data.append({
            "name": row["nazwa"],
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "cat": category
        })
    return data

def seed(filename, category):
    data = read_data(filename, category)
    
    for item in data:
        # Tworzymy punkt (longitude, latitude)
        pnt = Point(item['lng'], item['lat'])
        Attraction.objects.get_or_create(
            name=item['name'],
            defaults={'location': pnt, 'category': item['cat'], 'description': 'Super miejsce!'}
        )


if __name__ == '__main__':

    seed("museums.csv", "Muzeum")
    seed("zabytki.csv", "Zabytki")
    seed("kosciol.csv", "Kościół")
    seed("krasnale.csv", "Krasnal")
    seed("parks.csv", "Natura")