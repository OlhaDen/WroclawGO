from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Attraction

class AttractionSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Attraction
        geo_field = "location"  # To pole zostanie zamienione na geometrię GeoJSON
        fields = ("id", "name", "description", "category")
        
