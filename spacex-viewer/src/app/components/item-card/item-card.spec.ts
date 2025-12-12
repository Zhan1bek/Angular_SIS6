import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemCardComponent } from './item-card';
import { FavoritesService } from '../../services/favorites';
import { Launch } from '../../models/launch';

describe('ItemCardComponent', () => {
  let component: ItemCardComponent;
  let fixture: ComponentFixture<ItemCardComponent>;
  let mockFavoritesService: jasmine.SpyObj<FavoritesService>;

  const mockLaunch: Launch = {
    id: '1',
    name: 'Test Launch',
    date_utc: '2024-01-01T00:00:00.000Z',
    success: true,
    details: 'Test details',
    links: {
      patch: { small: 'test.jpg' },
      flickr: { original: [] }
    },
    rocket: 'rocket-id',
    launchpad: 'launchpad-id'
  };

  beforeEach(async () => {
    mockFavoritesService = jasmine.createSpyObj('FavoritesService', ['toggleFavorite', 'isFavorite'], {
      favorites$: jasmine.createSpy('favorites$').and.returnValue({ subscribe: () => {} })
    });

    await TestBed.configureTestingModule({
      imports: [ItemCardComponent],
      providers: [
        { provide: FavoritesService, useValue: mockFavoritesService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemCardComponent);
    component = fixture.componentInstance;
    component.item = mockLaunch;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have item input', () => {
    expect(component.item).toEqual(mockLaunch);
  });

  it('should toggle favorite on click', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    spyOn(event, 'stopPropagation');
    
    component.onToggleFavorite(event);
    
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(mockFavoritesService.toggleFavorite).toHaveBeenCalledWith('1');
  });

  it('should check if item is favorite', () => {
    mockFavoritesService.isFavorite.and.returnValue(true);
    
    const isFavorite = component.favorites.isFavorite('1');
    
    expect(mockFavoritesService.isFavorite).toHaveBeenCalledWith('1');
    expect(isFavorite).toBe(true);
  });

  it('should handle item without id', () => {
    component.item = { ...mockLaunch, id: '' };
    
    const event = new MouseEvent('click');
    component.onToggleFavorite(event);
    
    expect(mockFavoritesService.toggleFavorite).toHaveBeenCalledWith('');
  });
});
