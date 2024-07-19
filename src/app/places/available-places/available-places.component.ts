import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { catchError, map, single, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {

  error = signal('');
  isFetching = signal<boolean>(false);
  places = signal<Place[] | undefined>(undefined);

  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{ places: Place[] }>('http://localhost:3000/places')
      .pipe(map(resData => resData.places),
        catchError(
          (err) => {
            console.log(err)
            return throwError(
              () =>
                new Error(
                  `Something went wrong fetching the available places. Please try again later.`
                )
            )
          }
        )
      )
      .subscribe(
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
