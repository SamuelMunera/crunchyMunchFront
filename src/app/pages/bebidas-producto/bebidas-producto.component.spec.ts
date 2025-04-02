import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BebidasProductoComponent } from './bebidas-producto.component';

describe('NuestrosProductosComponent', () => {
  let component: BebidasProductoComponent;
  let fixture: ComponentFixture<BebidasProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BebidasProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BebidasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
