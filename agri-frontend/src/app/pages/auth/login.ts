import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { MarketService } from '../service/market.service';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
        ToastModule,
        MessageModule
    ],
    templateUrl: './login.html',
    providers: [MessageService]
})
export class Login implements OnInit {
    constructor(private marketService: MarketService, private router: Router, private messageService: MessageService) { }
    mobile: string = '';
    password: string = '';
    checked: boolean = false;
    ngOnInit(): void {
        localStorage.removeItem('token')
        localStorage.removeItem('userdetails')

    }

    lognIn() {
        if (this.mobile && this.password) {
            this.marketService.login({ mobile: this.mobile, password: this.password }).subscribe(
                (res: any) => {
                    localStorage.setItem("token", res.token);
                    localStorage.setItem("userdetails", JSON.stringify(res.user));

                    this.messageService.add({ severity: 'success', summary: 'Logged In', detail: 'Logged in successful' });
                    setTimeout(() => {
                        this.router.navigate(['']);
                    }, 1200)

                },
                err => {
                    this.messageService.add({ severity: 'error', summary: 'Logged In', detail: err.error.message });
                }
            );
        } else {
            this.messageService.add({ severity: 'error', summary: 'Required', detail: 'Both mobile and password required' });

        }
        // console.log(th)
    }

    onClickregistration() {
        this.router.navigate(['/registration']);
    }
}
