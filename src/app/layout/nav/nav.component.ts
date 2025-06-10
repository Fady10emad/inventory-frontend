import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { localStorageKeys } from '@app/core/enums/localStorageKeys';
import { AuthService } from '@app/core/service/auth.service';
import { appRoutes } from '@app/shared/routers/appRouters';
import { ThemeService } from '@core/service/theme.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router,
    private spinnerService: NgxSpinnerService
  ) {}
  appRoutes = appRoutes;
  isCollapsed: boolean = true;
  isCollapsedUser: boolean = true;
  userName = localStorage.getItem(localStorageKeys.userName);

  ngOnInit() {}

  unCollapseNav() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.spinnerService.show();
    this.authService.logout();
    this.spinnerService.hide();
    this.router.navigate([`${appRoutes.auth.base}/${appRoutes.auth.login}`]);
  }
}
