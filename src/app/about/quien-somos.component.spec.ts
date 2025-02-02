import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuienSomosComponent } from './quien-somos.component';

describe('QuienSomosComponent', () => {
  let component: QuienSomosComponent;
  let fixture: ComponentFixture<QuienSomosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuienSomosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuienSomosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
