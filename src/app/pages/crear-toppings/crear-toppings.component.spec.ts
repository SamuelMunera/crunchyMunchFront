import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearToppingsComponent } from './crear-toppings.component';

describe('CrearToppingsComponent', () => {
  let component: CrearToppingsComponent;
  let fixture: ComponentFixture<CrearToppingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearToppingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearToppingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
