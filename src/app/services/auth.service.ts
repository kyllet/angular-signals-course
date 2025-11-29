import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

const USER_STORAGE_KEY = 'user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #userSignal = signal<User | null>(null);

  user = this.#userSignal.asReadonly();

  isLoggedIn = computed(() => !!this.#userSignal());
  http = inject(HttpClient);
  router = inject(Router);

  async login(email: string, password: string): Promise<User> {
    const login$ = this.http.post<User>(`${environment.apiRoot}/login`, {
      email,
      password,
    });

    const user = await firstValueFrom(login$);

    this.#userSignal.set(user);

    return user;
  }

  logout() {
    localStorage.removeItem(USER_STORAGE_KEY);
    this.#userSignal.set(null);
    this.router.navigate(['/login']);
  }

  loadUserStorage() {
    const json = localStorage.getItem(USER_STORAGE_KEY);
    if (json) {
      const user = JSON.parse(json);
      this.#userSignal.set(user);
      return user;
    }
  }

  constructor() {
    this.loadUserStorage();
    effect(() => {
      const user = this.user();
      if (user) {
        console.log(user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      }
    });
  }
}
