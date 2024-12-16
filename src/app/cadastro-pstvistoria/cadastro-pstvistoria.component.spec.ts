import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPstvistoriaComponent } from './cadastro-pstvistoria.component';

describe('CadastroPstvistoriaComponent', () => {
  let component: CadastroPstvistoriaComponent;
  let fixture: ComponentFixture<CadastroPstvistoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPstvistoriaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroPstvistoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
