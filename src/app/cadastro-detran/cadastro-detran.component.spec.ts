import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroDetranComponent } from './cadastro-detran.component';

describe('CadastroDetranComponent', () => {
  let component: CadastroDetranComponent;
  let fixture: ComponentFixture<CadastroDetranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroDetranComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CadastroDetranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
