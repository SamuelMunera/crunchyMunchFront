import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearIceCreamComponent } from './crear-iceCream.component';

describe('CrearToppingsComponent', () => {
  let component: CrearIceCreamComponent;
  let fixture: ComponentFixture<CrearIceCreamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearIceCreamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearIceCreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
