import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LinkToShorten } from '../models/link-to-shorten.model';
import { ShortenedLink } from '../models/shortened-link.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BitlyServiceService {

  private url = 'https://api-ssl.bitly.com/v4/shorten';

  constructor(private http: HttpClient) { }

  createLink(link: LinkToShorten): Observable<ShortenedLink> {
    if (!environment.bitlyToken) {
      return throwError(new Error('Bitly access token is not configured. Set bitlyToken in src/environments.'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${environment.bitlyToken}`
    });

    return this.http.post<ShortenedLink>(this.url, { long_url: link.long_url }, { headers }).pipe(
      catchError((err: HttpErrorResponse) => throwError(new Error(describeError(err))))
    );
  }
}

// Bitly v4 error bodies look like { message, description, errors[] }; surface those instead of the raw object.
function describeError(err: HttpErrorResponse): string {
  const body = err.error && typeof err.error === 'object' ? err.error : null;
  const detail: string | undefined = body?.description || body?.message;

  switch (err.status) {
    case 0:
      return 'Could not reach Bitly. Check your internet connection and try again.';
    case 400:
      return detail ? `Bitly rejected that URL: ${detail}` : 'That URL is not valid.';
    case 401:
    case 403:
      return 'Bitly rejected the access token. It may be expired or revoked — generate a new one at app.bitly.com.';
    case 429:
      return 'Bitly rate limit reached. Please wait a moment and try again.';
    default:
      return detail ? `Bitly error (${err.status}): ${detail}` : `Unexpected error (${err.status || 'unknown'}). Please try again.`;
  }
}
