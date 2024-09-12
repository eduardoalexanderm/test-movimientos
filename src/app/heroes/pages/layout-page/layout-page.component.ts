import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrls: ['./layout-page.component.css']
})
export class LayoutPageComponent {


  public sidebarItems = [
    {
      label: 'Listado', icon: 'list', link: './list'
    },
    // {
    //   label: 'Agregar', icon: 'add', link: './new-hero'
    // },
    // {
    //   label: 'Buscar', icon: 'search', link: './search'
    // }
  ]

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  get user(): User | undefined {
    return this.authService.currentUser;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}
