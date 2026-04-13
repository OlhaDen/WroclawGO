import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-avatar-achievements',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './avatar-achievements.component.html',
  styleUrl: './avatar-achievements.component.css'
})
export class AvatarAchievementsComponent {}
