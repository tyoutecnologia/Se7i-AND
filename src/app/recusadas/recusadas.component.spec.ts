import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecusadasComponent } from './recusadas.component';

describe('RecusadasComponent', () => {
  let component: RecusadasComponent;
  let fixture: ComponentFixture<RecusadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecusadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecusadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
