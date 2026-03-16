export interface AttractionProperties {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface AttractionGeometry {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface AttractionFeature {
  type: 'Feature';
  geometry: AttractionGeometry;
  properties: AttractionProperties;
}

export interface AttractionGeoJSON {
  type: 'FeatureCollection';
  features: AttractionFeature[];
}