import { Component } from '@angular/core';
import { InfoCardComponent } from '../info-card/info-card.component';

@Component({
  selector: 'app-enviadas',
  standalone: true,
  imports: [InfoCardComponent],
  templateUrl: './enviadas.component.html',
})
export class EnviadasComponent {}
