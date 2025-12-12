import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ItemsService } from './items';
import { SpacexService } from '../spacex';

describe('ItemsService', () => {
  let service: ItemsService;
  let mockSpacexService: jasmine.SpyObj<SpacexService>;

  beforeEach(() => {
    mockSpacexService = jasmine.createSpyObj('SpacexService', ['getLaunches', 'searchLaunches', 'getLaunch']);

    TestBed.configureTestingModule({
      providers: [
        { provide: SpacexService, useValue: mockSpacexService }
      ]
    });
    service = TestBed.inject(ItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get items without query', () => {
    const mockResponse = {
      docs: [],
      totalDocs: 0,
      page: 1,
      limit: 10
    };
    mockSpacexService.getLaunches.and.returnValue(of(mockResponse));

    service.getItems(undefined, 1, 10).subscribe(result => {
      expect(result.items).toEqual([]);
      expect(mockSpacexService.getLaunches).toHaveBeenCalledWith(10, 1);
    });
  });

  it('should search items with query', () => {
    const mockResponse = {
      docs: [],
      totalDocs: 0,
      page: 1,
      limit: 10
    };
    mockSpacexService.searchLaunches.and.returnValue(of(mockResponse));

    service.getItems('test', 1, 10).subscribe(result => {
      expect(result.items).toEqual([]);
      expect(mockSpacexService.searchLaunches).toHaveBeenCalledWith('test', false, 10, 1);
    });
  });

  it('should get item by id', () => {
    const mockItem = { id: '1', name: 'Test', date_utc: '2024-01-01', links: { patch: { small: '' }, flickr: { original: [] } }, rocket: '', launchpad: '' };
    mockSpacexService.getLaunch.and.returnValue(of(mockItem));

    service.getItemById('1').subscribe(result => {
      expect(result).toEqual(mockItem);
      expect(mockSpacexService.getLaunch).toHaveBeenCalledWith('1');
    });
  });
});
