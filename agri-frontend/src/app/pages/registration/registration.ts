import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { MarketService } from '../service/market.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule, NgIf } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { take } from 'rxjs';

@Component({
  selector: 'app-registration',
  imports: [
    ToastModule,
    MessageModule,
    CommonModule,
    SelectModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RouterModule, RippleModule, AppFloatingConfigurator],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  providers: [MessageService]

})
export class Registration implements OnInit {
  constructor(private messageService: MessageService, private fb: FormBuilder, private marketService: MarketService, private router: Router) { }
  submitted = false;
  states: any = [];
  districts: any = [];
  cropList: any = [];

  registerForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    mobile: new FormControl(''),
    email: new FormControl(''),
    state: new FormControl(''),
    district: new FormControl(''),
    crops: new FormControl(''),
    password: new FormControl(''),
    newPassword: new FormControl(''),
  });

  ngOnInit(): void {
    this.getStates();
    this.getAllCropsList();
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      state: [null, Validators.required],
      district: [null, Validators.required],
      crops: [[], Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', Validators.required]
    });
  }
  getStates() {
    this.marketService.getStates().pipe(take(1)).subscribe(res => {
      this.states = res || []
      this.districts = [];
    }, err => {
      this.states = [];
      this.districts = [];
    })
  }
  getAllCropsList() {
    this.marketService.getAllCropsList().pipe(take(1)).subscribe(res => {
      this.cropList = res || []
    }, err => {
      this.cropList = [];
    })
  }
  loadDistricts() {
    const selectedState = this.registerForm.get('state')?.value;
    if (selectedState) {
      this.marketService.loadDistricts(selectedState).pipe(take(1)).subscribe((res) => {
        this.districts = res || []
      }, err => {
        this.districts = []
      })
    } else {
      this.districts = []
    }
  }
  markAsTouched(controlName: string) {
    const control = this.registerForm.get(controlName);
    control?.markAsTouched();
    control?.markAsDirty();
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  passwordMismatch(): any {
    return (
      this.registerForm.get('password')?.value !==
      this.registerForm.get('newPassword')?.value &&
      (this.registerForm.get('newPassword')?.touched ||
        this.registerForm.get('newPassword')?.dirty)
    );
  }

  register() {
    this.submitted = true
    if (this.registerForm.invalid || this.passwordMismatch()) {
      this.registerForm.markAllAsTouched();
      return;
    }
    console.log("FORM SUBMITTED", this.registerForm.value);
    this.marketService.register(this.registerForm.value).subscribe(
      (res: any) => {
        this.messageService.add({ severity: 'success', summary: 'Registration', detail: 'Registration Successful' });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200)
      },
      err => {
        this.messageService.add({ severity: 'error', summary: "Error", detail: err.error.message });
      }

    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }




}
