import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';
import { AuthUser } from '../../models/auth.model';
import { SkinColor } from '../../models/skin-color.model';

@Component({
  selector: 'app-avatar-shop',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './avatar-shop.component.html',
  styleUrl: './avatar-shop.component.css'
})
export class AvatarShopComponent implements OnInit {
  private readonly shopService = inject(ShopService);
  private readonly authService = inject(AuthService);

  readonly currentUser$ = this.authService.currentUser$;
  skinColors: SkinColor[] = [];
  loading = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadSkinColors();
  }

  loadSkinColors(): void {
    this.loading = true;
    this.errorMessage = null;

    this.shopService.getSkinColors().subscribe({
      next: (skins) => {
        this.skinColors = skins;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load skin colors at this time.';
        this.loading = false;
      }
    });
  }

  isOwned(user: AuthUser, skin: SkinColor): boolean {
    return user.owned_skins.some((owned) => owned.id === skin.id);
  }

  purchaseSkin(skinId: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.shopService.purchaseSkin(skinId).subscribe({
      next: () => {
        this.authService.fetchCurrentUser().subscribe();
        this.loadSkinColors();
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Purchase failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
