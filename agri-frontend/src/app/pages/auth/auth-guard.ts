import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MarketService } from '../service/market.service';

export const authGuard: CanActivateFn = (route, state) => {
  const marketService = inject(MarketService);
  const router = inject(Router);

  if (marketService.isLoggedIn()) { // Assume isLoggedIn() checks authentication status
    return true;
  } else {
    router.navigate(['/login']); // Redirect to login page if not authenticated
    return false;
  }
};
