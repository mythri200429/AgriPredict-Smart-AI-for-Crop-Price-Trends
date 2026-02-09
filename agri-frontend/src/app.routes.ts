import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { Access } from '@/pages/auth/access';
import { Login } from '@/pages/auth/login';
import { RatePredict } from '@/pages/ratepredict/ratepredict';
import { Cropdetails } from '@/pages/cropdetails/cropdetails';
import { Registration } from '@/pages/registration/registration';
import { authGuard } from '@/pages/auth/auth-guard';
import { UserProfile } from '@/pages/user-profile/user-profile';
import { Main } from '@/pages/main/main';

export const appRoutes: Routes = [
    {
        path: '', component: AppLayout, children: [
            { path: '', component: Dashboard, canActivate: [authGuard] },
            { path: 'predict', component: RatePredict, canActivate: [authGuard] },
            { path: 'cropdetails', component: Cropdetails, canActivate: [authGuard] },
            { path: 'userprofile', component: UserProfile, canActivate: [authGuard] },
            { path: 'currentrate', component: Main, canActivate: [authGuard] },


        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'login', component: Login },
    { path: 'registration', component: Registration },
    { path: '**', redirectTo: '/notfound' }
];
