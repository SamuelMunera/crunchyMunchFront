import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqrsComponent } from './pqrs.component';

describe('PqrsComponent', () => {
  let component: PqrsComponent;
  let fixture: ComponentFixture<PqrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PqrsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PqrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
