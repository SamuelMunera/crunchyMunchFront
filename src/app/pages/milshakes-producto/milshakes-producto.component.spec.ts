import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilshakesProductoComponent } from './milshakes-producto.component';

describe('NuestrosProductosComponent', () => {
  let component: MilshakesProductoComponent;
  let fixture: ComponentFixture<MilshakesProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MilshakesProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MilshakesProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
