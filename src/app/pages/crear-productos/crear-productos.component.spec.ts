import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProductosComponent } from './crear-productos.component';

describe('CrearProductosComponent', () => {
  let component: CrearProductosComponent;
  let fixture: ComponentFixture<CrearProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearProductosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
