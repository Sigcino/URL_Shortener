import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LinkToShorten } from '../models/link-to-shorten.model';
import { ShortenedLink } from '../models/shortened-link.model';
import { BitlyServiceService } from '../service/bitly-service.service';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent implements OnInit {

  urlResult = false;
  linkToShorten = new LinkToShorten();
  answer = new ShortenedLink(); //SHORTENED URL

  error = false;
  message: string='';

  constructor(private service: BitlyServiceService) { }

  ngOnInit(): void {
  }

  getShortLink()
  {
    if(this.linkToShorten.long_url != '')
    {
      this.service.createLink(this.linkToShorten).subscribe(
        (res : any)=>
        {
          if(res)
          {
            this.answer=res;
            console.log(this.answer.link)
          }
          console.log(res);
          this.urlResult = true;
        },
        (error: any) =>
        {
          console.log("There was an error", error);
          setTimeout(() => {
            this.error = true;
            this.message = "There was an error: "+ error;
          }, 3000)

        }
      )
    }
    else
    {      
      setTimeout(() => {
        this.error = true;
        this.message = "Please put a valid URL: https://example.com"
      }, 3000)
    }

  }

}
