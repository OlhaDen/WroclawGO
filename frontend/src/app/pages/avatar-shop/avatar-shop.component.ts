import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ShopService } from '../../services/shop.service';
import { AuthUser } from '../../models/auth.model';
import { SkinColor } from '../../models/skin-color.model';

const SKIN_IMAGE_PATH = '/assets/avatar-skins/';

@Component({
  selector: 'app-avatar-shop',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './avatar-shop.component.html',
  styleUrls: ['./avatar-shop.component.css']
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
      next: (skins: SkinColor[]) => {
        this.skinColors = skins;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load skin colors at this time.';
        this.loading = false;
      }
    });
  }

  getSkinImageFileName(skin: SkinColor): string {
    return skin.imageFileName || `${this.toSlug(skin.name)}.png`;
  }

  getSkinImageUrl(skin: SkinColor): string {
    return `${SKIN_IMAGE_PATH}${this.getSkinImageFileName(skin)}`;
  }

  toSlug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  isOwned(user: AuthUser, skin: SkinColor): boolean {
    return user.owned_skins.some((owned) => owned.id === skin.id);
  }

  isActive(user: AuthUser, skin: SkinColor): boolean {
    return user.selected_skin?.id === skin.id;
  }

  canAfford(user: AuthUser, skin: SkinColor): boolean {
    return user.points >= skin.price;
  }

  buttonLabel(user: AuthUser, skin: SkinColor): string {
    if (this.isActive(user, skin)) {
      return 'Active';
    }

    if (this.isOwned(user, skin)) {
      return 'Select';
    }

    return this.canAfford(user, skin) ? 'Buy' : 'Not enough points';
  }

  buttonClass(user: AuthUser, skin: SkinColor): string {
    if (this.isActive(user, skin)) {
      return 'ghost';
    }

    if (this.isOwned(user, skin)) {
      return 'secondary';
    }

    return this.canAfford(user, skin) ? 'primary' : 'disabled';
  }

  buttonDisabled(user: AuthUser, skin: SkinColor): boolean {
    if (this.loading) {
      return true;
    }

    return this.isActive(user, skin) || (!this.isOwned(user, skin) && !this.canAfford(user, skin));
  }

  onPrimaryAction(user: AuthUser, skin: SkinColor): void {
    if (this.isOwned(user, skin)) {
      this.selectSkin(skin.id);
      return;
    }

    this.purchaseSkin(skin.id);
  }

  purchaseSkin(skinId: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.shopService.purchaseSkin(skinId).subscribe({
      next: () => {
        this.loadSkinColors();
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Purchase failed. Please try again.';
        this.loading = false;
      }
    });
  }

  selectSkin(skinId: number): void {
    this.loading = true;
    this.errorMessage = null;

    this.shopService.selectSkin(skinId).subscribe({
      next: () => {
        this.loadSkinColors();
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Failed to select skin. Please try again.';
        this.loading = false;
      }
    });
  }

  badgeLabel(user: AuthUser, skin: SkinColor): string {
    if (this.isActive(user, skin)) {
      return 'Active';
    }

    if (this.isOwned(user, skin)) {
      return 'Owned';
    }

    return 'Premium';
  }

  badgeClass(user: AuthUser, skin: SkinColor): string {
    if (this.isActive(user, skin)) {
      return 'badge--active';
    }

    if (this.isOwned(user, skin)) {
      return 'badge--owned';
    }

    return 'badge--premium';
  }
}
