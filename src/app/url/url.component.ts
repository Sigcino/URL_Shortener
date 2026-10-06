import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LinkToShorten } from '../models/link-to-shorten.model';
import { ShortenedLink } from '../models/shortened-link.model';
import { BitlyServiceService } from '../service/bitly-service.service';

@Component({
  selector: 'app-url',
  templateUrl: './url.component.html',
  styleUrls: ['./url.component.css']
})
export class UrlComponent implements OnDestroy {

  linkToShorten = new LinkToShorten();
  result: ShortenedLink | null = null;
  errorMessage = '';
  loading = false;
  copied = false;

  private request?: Subscription;
  private copiedTimer?: ReturnType<typeof setTimeout>;

  constructor(private service: BitlyServiceService) { }

  getShortLink(): void {
    if (this.loading) {
      return;
    }

    const normalized = normalizeUrl(this.linkToShorten.long_url);
    if (!normalized) {
      this.errorMessage = 'Please enter a valid web address, e.g. https://example.com';
      return;
    }

    this.linkToShorten.long_url = normalized;
    this.errorMessage = '';
    this.result = null;
    this.loading = true;

    this.request = this.service.createLink(this.linkToShorten)
      .pipe(finalize(() => this.loading = false))
      .subscribe(
        res => {
          if (res?.link) {
            this.result = res;
          } else {
            this.errorMessage = 'Bitly returned an unexpected response. Please try again.';
          }
        },
        (err: Error) => this.errorMessage = err.message
      );
  }

  async copyLink(): Promise<void> {
    if (!this.result?.link) {
      return;
    }
    try {
      await navigator.clipboard.writeText(this.result.link);
      this.copied = true;
      clearTimeout(this.copiedTimer);
      this.copiedTimer = setTimeout(() => this.copied = false, 2000);
    } catch {
      // Clipboard API requires a secure context; the link stays selectable as a fallback.
      this.errorMessage = 'Could not copy automatically — select the link and copy it manually.';
    }
  }

  reset(): void {
    this.linkToShorten = new LinkToShorten();
    this.result = null;
    this.errorMessage = '';
    this.copied = false;
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    clearTimeout(this.copiedTimer);
  }
}

// Accepts bare domains ("example.com") by assuming https; rejects anything that isn't http(s).
function normalizeUrl(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim();
  if (!value) {
    return null;
  }
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const parsed = new URL(candidate);
    if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !parsed.hostname.includes('.')) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}
