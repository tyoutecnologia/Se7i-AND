import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AguardandoAprovacaoComponent } from './aguardando-aprovacao.component';

describe('AguardandoAprovacaoComponent', () => {
  let component: AguardandoAprovacaoComponent;
  let fixture: ComponentFixture<AguardandoAprovacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AguardandoAprovacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AguardandoAprovacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
