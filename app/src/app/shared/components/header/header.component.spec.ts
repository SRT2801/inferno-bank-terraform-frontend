import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title', () => {
    expect(component.title).toBe('Inferno Bank Services');
  });

  it('should display default icon', () => {
    expect(component.icon).toBe('hub');
  });

  it('should accept custom title', () => {
    component.title = 'Custom Title';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Custom Title');
  });

  it('should accept custom icon', () => {
    component.icon = 'home';
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('span').textContent.trim()).toBe('home');
  });
});
