import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarVistoriaFormComponent } from './criar-servico-form.component';

describe('CriarVistoriaFormComponent', () => {
  let component: CriarVistoriaFormComponent;
  let fixture: ComponentFixture<CriarVistoriaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarVistoriaFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CriarVistoriaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
