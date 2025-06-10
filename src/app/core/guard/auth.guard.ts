import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { appRoutes } from '@app/shared/routers/appRouters';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    authService.logout();
    router.navigate([appRoutes.auth.base, appRoutes.auth.login], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
  return true;
};
