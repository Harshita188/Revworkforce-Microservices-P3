import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authService.currentUserValue;
    const expectedRoles = route.data['roles'] as Array<string>;

    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Role format returned from backend can be e.g. "ADMIN", "MANAGER"
    const hasRole = expectedRoles.includes(currentUser.role);
    
    if (!hasRole) {
      // route to a default authenticated page (or an unauthorized error page)
      if (currentUser.role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (currentUser.role === 'MANAGER') {
        this.router.navigate(['/manager-dashboard']);
      } else {
        this.router.navigate(['/employee-dashboard']);
      }
      return false;
    }

    return true;
  }
}
