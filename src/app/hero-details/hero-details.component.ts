import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-details',
  template: `<div *ngIf="hero">
      <h2>{{ hero.name | uppercase }} Details</h2>
      <div><span>id: </span>{{ hero.id }}</div>
      <div><span>name: </span>{{ hero.name }}</div>
      <div>
        <label
          >name:
          <input [(ngModel)]="hero.name" placeholder="name" />
        </label>
      </div>
    </div>
    <button (click)="save()">save</button>
    <button (click)="goBack()">go back</button> `,
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
    this._hero.getHero(id).subscribe((hero) => (this.hero = hero));
  }
  goBack(): void {
    this._location.back();
  }
  save(): void {
    this._hero.updateHero(this.hero).subscribe(() => this.goBack());
  }
}
