import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LinkToShorten } from '../models/link-to-shorten.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitlyServiceService {

  private url = "https://api-ssl.bitly.com/v4/shorten"; //url to bitly web API
  private token = "85cb9d050c6b2751669695f8db8ea352c795663d"; //TOKEN here



  constructor(private http: HttpClient) { }

  createLink(Link: LinkToShorten): Observable<any>
  {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': "Bearer "+ this.token }) }; 
    console.log(Link);
    return this.http.post(this.url, Link, httpOptions);
  }

}
