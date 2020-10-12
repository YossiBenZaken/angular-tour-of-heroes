import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  template: `<div id="search-component">
  <div #conSearch class="con-search notValue">
    <div class="con-input">
      <input
        #searchBox
        (blur)="handleBlur()"
        (focus)="handleFocus(searchBox)"
        placeholder="Search User"
        (input)="search(searchBox.value)"
        type="text"
      />
      <i class="bx bx-search"></i>
      <i class="bx bx-x" (click)="handleRemove()"></i>
    </div>
    <div class="content-results">
      <div class="con-results" *ngIf="(heroes$ | async)?.length > 0">
        <div
          *ngFor="let hero of heroes$ | async"
          class="result"
          routerLink="/detail/{{ hero.id }}"
        >
          <h5>
            {{ hero.name }}
          </h5>
        </div>
      </div>
      <div class="not-results" *ngIf="(heroes$ | async)?.length == 0">
        Not Results
      </div>
    </div>
  </div>
</div>
`,
  styleUrls: ['./hero-search.component.scss'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]>;
  @ViewChild('conSearch') conSearch: ElementRef;
  private searchTerms = new Subject<string>();

  constructor(private _hero: HeroService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }
  handleBlur(): void {
    this.conSearch.nativeElement.classList.remove('focus');
  }
  handleFocus(e: HTMLInputElement): void {
    if (e.value) {
      this.conSearch.nativeElement.classList.add('focus');
    }
  }
  handleRemove(): void {
    this.conSearch.nativeElement.querySelector('input').value = '';
    this.conSearch.nativeElement.classList.add('notValue');
  }
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        if (!term) {
          this.conSearch.nativeElement.classList.remove('focus');
          this.conSearch.nativeElement.classList.add('notValue');
        } else {
          this.conSearch.nativeElement.classList.remove('notValue');
          this.conSearch.nativeElement.classList.add('focus');
        }
        return this._hero.searchHeroes(term);
      } )
    );
  }
}
