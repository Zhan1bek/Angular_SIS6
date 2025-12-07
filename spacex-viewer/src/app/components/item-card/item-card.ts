import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Launch } from '../../models/launch';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './item-card.html',
  styleUrl: './item-card.css'
})
export class ItemCardComponent {
  @Input({ required: true }) item!: Launch;

  constructor(public favorites: FavoritesService) {}

  onToggleFavorite(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.favorites.toggleFavorite(this.item.id);
  }
}
