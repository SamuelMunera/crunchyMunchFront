import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieProductoComponent } from './cookie-producto.component';

describe('NuestrosProductosComponent', () => {
  let component: CookieProductoComponent;
  let fixture: ComponentFixture<CookieProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CookieProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
