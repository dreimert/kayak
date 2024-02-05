import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { User } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User | null>(null);

  constructor (@Inject(PLATFORM_ID) private platformId:Object) {
    // if (isPlatformBrowser(platformId)) {
    //   const user = localStorage.getItem('user')

    //   if (user) {
    //     this.user.next(JSON.parse(user))
    //   }
    // }
  }

  async login (user: User) {
    // TODO: call API to login

    // localStorage.setItem('user', JSON.stringify(user))
    this.user.next(user)
  }

  async signup (mail: string) {
    // TODO: call API to send mail
  }

  async logout () {
    // TODO: call API to logout
    localStorage.removeItem('user')
    this.user.next(null)
  }
}
