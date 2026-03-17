from django.db import models

from django.contrib.gis.db import models

class Attraction(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.PointField(srid=4326) 
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name
