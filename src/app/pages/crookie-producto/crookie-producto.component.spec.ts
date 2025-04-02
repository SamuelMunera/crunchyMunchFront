import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrookieProductoComponent } from './crookie-producto.component';

describe('NuestrosProductosComponent', () => {
  let component: CrookieProductoComponent;
  let fixture: ComponentFixture<CrookieProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrookieProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrookieProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
