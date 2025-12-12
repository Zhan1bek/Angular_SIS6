import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    // Mock navigator for forms
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0'
    });

    await TestBed.configureTestingModule({
      imports: [SearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default placeholder', () => {
    expect(component.placeholder()).toBe('Search...');
  });

  it('should emit queryChange when model changes', () => {
    spyOn(component.queryChange, 'emit');
    
    component.model = 'test query';
    
    expect(component.queryChange.emit).toHaveBeenCalledWith('test query');
  });

  it('should clear query', () => {
    spyOn(component.queryChange, 'emit');
    
    component.query.set('test');
    component.clear();
    
    expect(component.query()).toBe('');
    expect(component.queryChange.emit).toHaveBeenCalledWith('');
  });

  it('should update query on model change', () => {
    spyOn(component.queryChange, 'emit');
    
    component.onModelChange('new query');
    
    expect(component.query()).toBe('new query');
    expect(component.queryChange.emit).toHaveBeenCalledWith('new query');
  });
});
