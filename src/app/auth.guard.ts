import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import e from 'express';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const completed = localStorage.getItem('completed');
    if (completed === 'true') {
      return true;
    } else {
      this.router.navigate(['/captcha']);
      return false;
    }
  }
}
