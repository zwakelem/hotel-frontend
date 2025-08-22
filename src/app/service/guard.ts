import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class Guard implements CanActivate {
  constructor(private apiService: Api, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiresAdmin = route.data['requiresAdmin'] || false;

    if (requiresAdmin) {
      if (this.apiService.isAdmin()) {
        return true;
      } else {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    } else {
      if (this.apiService.isAuthenticated()) {
        return true;
      } else {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
    }
  }
}
