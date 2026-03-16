import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttractionGeoJSON } from '../models/attraction.model';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {
  private apiUrl = 'http://localhost:8000/api/attractions/';

  constructor(private http: HttpClient) { }

  getAttractions(): Observable<AttractionGeoJSON> {
    return this.http.get<AttractionGeoJSON>(this.apiUrl);
  }
}