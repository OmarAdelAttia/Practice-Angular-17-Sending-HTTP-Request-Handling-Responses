import { Component, inject } from '@angular/core';

import { ErrorService } from './shared/error.service';
import { UserPlacesComponent } from './places/user-places/user-places.component';
import { ErrorModalComponent } from './shared/modal/error-modal/error-modal.component';
import { AvailablePlacesComponent } from './places/available-places/available-places.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [AvailablePlacesComponent, UserPlacesComponent, ErrorModalComponent],
})
export class AppComponent {
  private errorSrv = inject(ErrorService);

  error = this.errorSrv.error;
}
