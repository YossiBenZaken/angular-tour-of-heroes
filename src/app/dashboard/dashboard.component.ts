import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  template: `<h3>Top Heroes</h3>
    <div class="grid grid-pad">
      <a
        *ngFor="let hero of heroes"
        class="col-1-4"
        routerLink="/detail/{{ hero.id }}"
      >
        <div class="module hero">
          <h4>{{ hero.name }}</h4>
        </div>
      </a>
    </div>
    <app-hero-search></app-hero-search> `,
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(private _hero: HeroService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this._hero
      .getHeroes()
      .subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }
}
