import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCiretranComponent } from './cadastro-ciretran.component';

describe('CadastroCiretranComponent', () => {
  let component: CadastroCiretranComponent;
  let fixture: ComponentFixture<CadastroCiretranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCiretranComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroCiretranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
