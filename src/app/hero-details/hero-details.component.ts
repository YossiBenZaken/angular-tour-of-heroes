import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss'],
})
export class HeroDetailsComponent implements OnInit {
  @Input() hero: Hero;
  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _hero: HeroService
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = +this._route.snapshot.paramMap.get('id');
    this._hero.getHero(id)
      .subscribe(hero => this.hero = hero);
  }
  goBack(): void {
    this._location.back();
  }
  save(): void {
    this._hero.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }
}
