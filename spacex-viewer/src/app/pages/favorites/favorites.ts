import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites';
import { SpacexService } from '../../services/spacex';
import { Launch } from '../../models/launch';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ItemCardComponent } from '../../components/item-card/item-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css',
})
export class FavoritesPage {
  private favoritesService = inject(FavoritesService);
  private spacex = inject(SpacexService);

  favoritesIds$ = this.favoritesService.favorites$;
  mergeInfo$ = this.favoritesService.mergeInfo$;

  launches$ = this.favoritesIds$.pipe(
    switchMap((ids) => {
      if (!ids.length) return of<Launch[]>([]);
      return forkJoin(ids.map((id) => this.spacex.getLaunch(id)));
    })
  );

  onClearMergeMessage() {
    this.favoritesService.clearMergeInfo();
  }
}
