import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TusPedidosComponent } from './tus-pedidos.component';

describe('TusPedidosComponent', () => {
  let component: TusPedidosComponent;
  let fixture: ComponentFixture<TusPedidosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TusPedidosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TusPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
