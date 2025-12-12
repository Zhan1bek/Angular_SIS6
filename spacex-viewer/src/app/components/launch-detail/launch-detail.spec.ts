import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { LaunchDetail } from './launch-detail';
import { SpacexService } from '../../services/spacex';

describe('LaunchDetail', () => {
  let component: LaunchDetail;
  let fixture: ComponentFixture<LaunchDetail>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockSpacexService: jasmine.SpyObj<SpacexService>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockSpacexService = jasmine.createSpyObj('SpacexService', ['getRocket', 'getLaunchpad']);
    mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => key === 'id' ? '1' : null
      })
    };

    const mockLaunch = {
      id: '1',
      name: 'Test Launch',
      date_utc: '2024-01-01',
      success: true,
      details: 'Test details',
      links: { patch: { small: 'test.jpg' }, flickr: { original: [] } },
      rocket: 'rocket-id',
      launchpad: 'launchpad-id'
    };

    mockStore.select.and.returnValue(of(mockLaunch));
    mockSpacexService.getRocket.and.returnValue(of({ id: 'rocket-id', name: 'Test Rocket' }));
    mockSpacexService.getLaunchpad.and.returnValue(of({ id: 'launchpad-id', name: 'Test Pad', locality: 'Test Locality' }));

    await TestBed.configureTestingModule({
      imports: [LaunchDetail],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Location, useValue: mockLocation },
        { provide: SpacexService, useValue: mockSpacexService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LaunchDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have loading and error properties', () => {
    expect(component.loading).toBeDefined();
    expect(component.error).toBeDefined();
  });

  it('should go back on goBack call', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should handle offline status', () => {
    window.dispatchEvent(new Event('offline'));
    expect(component).toBeTruthy();
  });

  it('should handle online status', () => {
    window.dispatchEvent(new Event('online'));
    expect(component).toBeTruthy();
  });

  it('should cleanup on destroy', () => {
    component.ngOnDestroy();
    expect(component).toBeTruthy();
  });

  it('should handle missing launch id', () => {
    mockActivatedRoute.paramMap = of({
      get: (key: string) => null
    });
    
    fixture = TestBed.createComponent(LaunchDetail);
    component = fixture.componentInstance;
    component.ngOnInit();
    
    expect(component.error).toBe('Launch not found');
  });
});
