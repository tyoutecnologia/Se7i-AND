import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnviadasComponent } from './enviadas.component';

describe('EnviadasComponent', () => {
  let component: EnviadasComponent;
  let fixture: ComponentFixture<EnviadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnviadasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnviadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
