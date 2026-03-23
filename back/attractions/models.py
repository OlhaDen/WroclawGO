from django.db import models

from django.contrib.gis.db import models
from django.contrib.auth.models import AbstractUser

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Attraction(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.PointField(srid=4326) 
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='attractions')
    points_reward = models.IntegerField(default=10)
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    email = models.EmailField(unique=True)
    points = models.IntegerField(default=0)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.username