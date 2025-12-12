import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FavoritesPage } from './favorites';
import { FavoritesService } from '../../services/favorites';
import { SpacexService } from '../../services/spacex';

describe('FavoritesPage', () => {
  let component: FavoritesPage;
  let fixture: ComponentFixture<FavoritesPage>;
  let mockFavoritesService: jasmine.SpyObj<FavoritesService>;
  let mockSpacexService: jasmine.SpyObj<SpacexService>;

  beforeEach(async () => {
    mockFavoritesService = jasmine.createSpyObj('FavoritesService', ['clearMergeInfo'], {
      favorites$: of(['1', '2']),
      mergeInfo$: of(null)
    });
    mockSpacexService = jasmine.createSpyObj('SpacexService', ['getLaunch']);

    const mockLaunch = {
      id: '1',
      name: 'Test Launch',
      date_utc: '2024-01-01',
      success: true,
      details: 'Test',
      links: { patch: { small: '' }, flickr: { original: [] } },
      rocket: '',
      launchpad: ''
    };

    mockSpacexService.getLaunch.and.returnValue(of(mockLaunch));

    await TestBed.configureTestingModule({
      imports: [FavoritesPage],
      providers: [
        { provide: FavoritesService, useValue: mockFavoritesService },
        { provide: SpacexService, useValue: mockSpacexService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have favoritesIds$ observable', () => {
    expect(component.favoritesIds$).toBeDefined();
  });

  it('should have mergeInfo$ observable', () => {
    expect(component.mergeInfo$).toBeDefined();
  });

  it('should have launches$ observable', () => {
    expect(component.launches$).toBeDefined();
  });

  it('should clear merge info', () => {
    component.onClearMergeMessage();
    expect(mockFavoritesService.clearMergeInfo).toHaveBeenCalled();
  });
});
