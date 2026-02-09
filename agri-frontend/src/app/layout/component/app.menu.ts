import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/']
                    },
                    {
                        label: 'Rate Prediction',
                        icon: 'pi pi-fw pi-money-bill',
                        routerLink: ['/predict']
                    },
                    {
                        label: 'Crop Details',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['/cropdetails']
                    },
                    {
                        label: 'Current Rate Trends',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/currentrate']
                    },
                    {
                        label: 'User Profile',
                        icon: 'pi pi-fw pi-user',
                        routerLink: ['/userprofile']
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-out',
                        routerLink: ['/login']
                    }

                    // {
                    //     label: 'Login',
                    //     icon: 'pi pi-fw pi-sign-in',
                    //     routerLink: ['/login']
                    // },
                    // {
                    //     label: 'Error',
                    //     icon: 'pi pi-fw pi-times-circle',
                    //     routerLink: ['/error']
                    // },
                    // {
                    //     label: 'Access Denied',
                    //     icon: 'pi pi-fw pi-lock',
                    //     routerLink: ['/access']
                    // },
                    // {
                    //     label: 'Not Found',
                    //     icon: 'pi pi-fw pi-exclamation-circle',
                    //     routerLink: ['/notfound']
                    // }
                ],

            },

        ];
    }
}
