import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
declare const anime;
@Component({
  selector: 'app-heroes',
  template: `<div class="d-flex">
    <h2>My Heroes:</h2>
    <div>
      <label
        >Hero name:
        <input #heroName />
      </label>
      <button (click)="add(heroName.value); heroName.value = ''">add</button>
    </div>
    <div style="margin: 0 2em">
      <div
        (touchstart)="handleStart($event)"
        (touchmove)="handleTouchMove($event)"
        (touchend)="handleEnd($event)"
        (dragstart)="dragStart($event)"
        (drag)="drag($event)"
        (dragend)="dragEnd($event)"
        class="item swipe"
        *ngFor="let hero of heroes"
      >
        <button class="config" (click)="details(hero.id)">
          <div class="con-icon">
            <i class="bx bx-cog"></i>
          </div>
        </button>
        <div class="con-text" draggable="true">
          <p>{{ hero.id }}</p>
          <h3>{{ hero.name }}</h3>
        </div>
        <button class="remove" (click)="delete(hero)">
          <div class="con-icon">
            <i class="bx bxs-trash"></i>
          </div>
        </button>
      </div>
    </div>
  </div> `,
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
  handleStart(evt: any): void {
    evt.target.dataset.x =
      Number(evt.touches[0].pageX) + Number(evt.target.dataset.move || 0);
  }
  handleTouchMove(evt: any): void {
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
  handleEnd(evt: any): void {
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
  dragStart(evt: any): void {
    evt.target.dataset.x =
      Number(evt.pageX) + Number(evt.target.dataset.move || 0);
  }
  drag(evt: any): void {
    if (evt.pageX !== 0) {
      let moveX = Number(evt.target.dataset.x) - evt.pageX;
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
  }
  dragEnd(evt: any): void {
    if (evt.target.dataset.move > 100) {
      evt.target.dataset.move = -100;
    } else if (evt.target.dataset.move < -100) {
      evt.target.dataset.move = 100;
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
        translateX: Number(evt.target.dataset.move),
      });
    }, 1);
  }
}
