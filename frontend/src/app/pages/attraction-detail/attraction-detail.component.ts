import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-attraction-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './attraction-detail.component.html',
  styleUrl: './attraction-detail.component.css'
})
export class AttractionDetailComponent {
  private readonly route = inject(ActivatedRoute);

  readonly attractionId$ = this.route.paramMap.pipe(
    map((params) => params.get('id') || 'unknown')
  );
}
