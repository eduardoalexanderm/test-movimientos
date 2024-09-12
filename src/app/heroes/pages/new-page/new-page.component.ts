import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirmDialog/confirmDialog.component';
@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  constructor(
    private heroesServices: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }
  ngOnInit(): void {
    // parámetros obtener del url y setear la información en el formulario
    // obtenida por el endpoint getHeroById

    if (!this.router.url.includes('edit')) {
      return;
    }

    this.activatedRoute.params.pipe(
      switchMap(({ id }) => this.heroesServices.getHeroById(id))
    ).subscribe(
      hero => {
        if (!hero) {
          return this.router.navigateByUrl('/heroes/list');
        }
        // const { id, superhero, publisher, alter_ego, first_appearance, characters, alt_img } = hero;
        // this.heroForm.setValue({ id, superhero, publisher, alter_ego, first_appearance, characters, alt_img });
        return this.heroForm.reset(hero)
      }
    )

  }

  // para obtener el objeto del formulario como un objeto de tipo Hero
  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit() {
    if (this.heroForm.invalid) {
      this.heroForm.markAllAsTouched();
      return;
    }
    if (this.currentHero.id) {
      // update
      this.heroesServices.updateHero(this.currentHero).subscribe(hero => {
        this.showSnackbar(`${hero.id} updated!`);
      });

      return;
    }
    this.heroesServices.addHero(this.currentHero).subscribe(hero => {
      this.showSnackbar(`${hero.superhero} created!`);
      this.router.navigateByUrl('/heroes/edit/' + hero.id);

    });

    // console.log({
    //   formIsValid: this.heroForm.valid,
    //   value: this.heroForm.value,
    // })
    // console.log(this.heroForm.value);
  }

  onDeleteHero() {
    if (!this.currentHero.id) {
      throw new Error('The hero id is required');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef.afterClosed().pipe(
      filter((result: boolean) => result),
      switchMap(() => this.heroesServices.deleteHEroById(this.currentHero.id)),
      filter((wasDeleted: boolean) => wasDeleted),
    ).subscribe(() => {
      this.showSnackbar('Hero deleted!');
      this.router.navigateByUrl('/heroes/list');
    })


    // dialogRef.afterClosed().subscribe(

    //   result => {
    //     if (!result) {
    //       return;
    //     }
    //     this.heroesServices.deleteHEroById(this.currentHero.id)
    //       .subscribe(resp => {
    //         this.showSnackbar('Hero deleted!');
    //         this.router.navigateByUrl('/heroes/list');
    //       });
    //   }
    // )
  }


  showSnackbar(message: string) {
    this.snackbar.open(message, 'ok!', {
      duration: 2500
    });

  }
}
