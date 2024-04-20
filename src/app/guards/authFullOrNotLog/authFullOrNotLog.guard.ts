import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

export const authFullOrNotLogGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    map(user => !user || !!( user && user.name && user.phone )),
    tap(can => {
      if (!can) {
        return router.parseUrl('/profile');
      }

      return true
    })
  );
};
