import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SpacexService } from '../spacex';
import { Launch } from '../../models/launch';

export type Item = Launch;

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  constructor(private spacex: SpacexService) {}

  getItems(query?: string, page: number = 1): Observable<Item[]> {
    const term = query?.trim() ?? '';
    const limit = 120;

    if (term.length > 0) {
      return this.spacex.searchLaunches(term, false, limit);
    }


    return this.spacex.getLaunches(limit);
  }

  getItemById(id: string | number): Observable<Item> {
    return this.spacex.getLaunch(String(id));
  }
}
