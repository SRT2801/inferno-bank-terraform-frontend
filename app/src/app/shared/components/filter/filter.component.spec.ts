import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchTermChange when search changes', () => {
    spyOn(component.searchTermChange, 'emit');
    component.searchTerm = 'test';
    component.onSearchChange();
    expect(component.searchTermChange.emit).toHaveBeenCalledWith('test');
  });

  it('should emit categorySelect when category is selected', () => {
    spyOn(component.categorySelect, 'emit');
    component.selectCategory('Streaming');
    expect(component.categorySelect.emit).toHaveBeenCalledWith('Streaming');
  });

  it('should display correct placeholder', () => {
    component.placeholder = 'Custom placeholder';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.placeholder).toBe('Custom placeholder');
  });

  it('should display categories as buttons', () => {
    component.categories = ['Todos', 'Streaming', 'Música'];
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('Todos');
    expect(buttons[1].textContent.trim()).toBe('Streaming');
    expect(buttons[2].textContent.trim()).toBe('Música');
  });
});
