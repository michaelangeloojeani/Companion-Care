import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'pet-profile/:id',
    loadComponent: () => import('./pages/pet-profile/pet-profile.page').then(m => m.PetProfilePage),
    canActivate: [authGuard]
  },
  {
    path: 'add-pet',
    loadComponent: () => import('./pages/add-pet/add-pet.page').then(m => m.AddPetPage),
    canActivate: [authGuard]
  },
  {
    path: 'user-profile',
    loadComponent: () => import('./pages/user-profile/user-profile.page').then(m => m.UserProfilePage),
    canActivate: [authGuard]
  }
];