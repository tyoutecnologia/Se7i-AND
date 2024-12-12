import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarVistoriaComponent } from './criar-vistoria.component';

describe('CriarVistoriaComponent', () => {
  let component: CriarVistoriaComponent;
  let fixture: ComponentFixture<CriarVistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarVistoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarVistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
