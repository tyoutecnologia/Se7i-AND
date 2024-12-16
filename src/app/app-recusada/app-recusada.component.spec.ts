import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRecusadaComponent } from './app-recusada.component';

describe('AppRecusadaComponent', () => {
  let component: AppRecusadaComponent;
  let fixture: ComponentFixture<AppRecusadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRecusadaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppRecusadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
