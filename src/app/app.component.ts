import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ESLive';

  eventSource: EventSource;

  private sseStream: Subscription;

  constructor(
    @Inject(LOCALE_ID) public localeId: string,
    public router: Router,
  ) {
  }

  ngOnInit(): void {
    this.sseStream = this.observeMessages('/api/v1/realtime')
      .subscribe(message => {
        console.log(`Message`);
        console.log(message);
      });
  }

  observeMessages(sseUrl: string): Observable<string> {
    return new Observable<string>(obs => {
      const es = new EventSource(sseUrl);

      es.onopen = event => {
        // Reset reconnect frequency upon successful connection
        console.log(`RT: Connected`);
      };

      es.onmessage = event => {
        console.log('RT: no event specified');
      };

      es.addEventListener('heartbeat', (evt) => {
        console.log('RT: heartbeat');
        console.log(evt);
      });

      es.onerror = (error) => {
        console.log(`Error`);
        console.log(error);
      };

      return () => es.close();
    });
  }

  ngOnDestroy(): void {
    if (this.sseStream) {
      this.sseStream.unsubscribe();
    }
  }
}
