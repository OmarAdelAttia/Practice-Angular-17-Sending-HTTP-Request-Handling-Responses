import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {

  error = signal('');
  isFetching = signal<boolean>(false);
  places = signal<Place[] | undefined>(undefined);

  private destroyRef = inject(DestroyRef);
  private placesSrv = inject(PlacesService);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesSrv.loadUserPlaces().subscribe(
      {
        next: places => {
          this.places.set(places);
        },
        error: (error: Error) => {
          this.error.set(error.message)
        },
        complete: () => {
          this.isFetching.set(false);
        }
      }
    );
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
