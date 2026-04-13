import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-visited-attractions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './visited-attractions.component.html',
  styleUrl: './visited-attractions.component.css'
})
export class VisitedAttractionsComponent {}
