import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
declare const anime;
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {
  heroes: Hero[];
  selectedHero: Hero;
  constructor(private _hero: HeroService, private _router: Router) {}

  ngOnInit(): void {
    this.getHeroes();
  }
  getHeroes(): void {
    this._hero.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this._hero.addHero({ name } as Hero).subscribe((hero) => {
      this.heroes.push(hero);
    });
  }
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter((h) => h !== hero);
    this._hero.deleteHero(hero).subscribe();
  }
  handleStart(evt: any) {
    evt.target.dataset.x =
      Number(evt.touches[0].pageX) + Number(evt.target.dataset.move || 0);
  }
  handleTouchMove(evt: any) {
    let moveX = Number(evt.target.dataset.x) - evt.touches[0].pageX;
    if (moveX > 130) {
      moveX = 130;
    }
    if (moveX < -130) {
      moveX = -130;
    }
    evt.target.dataset.move = moveX;
    anime({
      targets: evt.target,
      translateX: -Number(evt.target.dataset.move),
      duration: 300,
    });
  }
  handleEnd(evt: any) {
    if (evt.target.dataset.move > 100) {
      evt.target.dataset.move = 100;
    } else if (evt.target.dataset.move < -100) {
      evt.target.dataset.move = -100;
    } else {
      evt.target.dataset.move = 0;
    }
    const swipes = document.querySelectorAll('.swipe') || [];
    swipes.forEach((item) => {
      if (item.querySelector('.con-text') === evt.target) {
        return;
      }
      item.querySelector('.con-text').dataset.move = 0;
      item.querySelector('.con-text').dataset.x = 0;
      anime({
        targets: item.querySelector('.con-text'),
        translateX: 0,
      });
    });
    setTimeout(() => {
      anime({
        targets: evt.target,
        translateX: -Number(evt.target.dataset.move),
      });
    }, 1);
  }
  details(hero: number): void {
    this._router.navigateByUrl(`detail/${hero}`);
  }
}
