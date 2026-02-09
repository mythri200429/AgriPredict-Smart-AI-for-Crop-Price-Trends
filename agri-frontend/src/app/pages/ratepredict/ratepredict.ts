import { Component, inject, OnInit } from '@angular/core';
import { MarketService } from '../service/market.service';
import { forkJoin, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-empty',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        ToastModule,
        TableModule,
        SelectModule,
        MessageModule,
        ButtonModule,
        InputTextModule,
        ProgressSpinnerModule,
        DatePickerModule,
    ],

    templateUrl: './ratepredict.html',
    styleUrl: './ratepredict.css',
    providers: [MessageService]
})
export class RatePredict implements OnInit {
    private marketService = inject(MarketService);
    datePrediction: any = {};
    predictions: any = [];
    stateList: any = [];
    districtList: any = [];
    commodityList: any = [];
    soilList: any = [];
    isLoading = true;
    isLoadingPrediction = false;
    isValid = true;
    message = ''
    filters = {
        state: null,
        district: null,
        soil: null,
        commodity: null,
        date: "26-11-2025"
    };
    selectedDate: Date = new Date();  // <-- today's date
    isError = false;
    ngOnInit(): void {
        this.getStates();
        this.getSoils();
    }
    getStates() {
        this.marketService.getStatesprediction().pipe(take(1)).subscribe(res => {
            this.stateList = res || []
            this.districtList = [];
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.stateList = [];
            this.districtList = [];
        })
    }
    getSoils() {
        this.marketService.getSoils().pipe(take(1)).subscribe((res: any) => {
            this.soilList = res?.map((r: any) => r.soilname) || []
            this.commodityList = [];
            this.isLoading = false;
        }, err => {
            this.isLoading = false;
            this.soilList = [];
            this.commodityList = [];
        })

    }
    resetFilters() {
        this.filters = {
            state: null,
            district: null,
            soil: null,
            commodity: null,
            date: "26-11-2025"
        };
        this.districtList = [];
        this.commodityList = [];
        this.isValid = true;
    }
    applyFilters() {
        let string = 'Please select'
        let isValid = true;
        if (!this.filters.state) {
            isValid = false;
            string = string + ' State,'
        }
        if (!this.filters.district) {
            isValid = false;
            string = string + ' District,'
        }
        if (!this.filters.soil) {
            isValid = false;
            string = string + ' Soil,'
        }
        if (!this.filters.commodity) {
            isValid = false;
            string = string + ' Crop'
        }
        string = string + ' from dropdown'
        this.isValid = isValid;
        this.message = string;
        if (this.isValid) {
            this.predictions = [];
            this.getProceMonthWise()
        }

    }
    loadDistricts() {
        if (this.filters?.state) {
            this.marketService.loadDistricts(this.filters?.state).pipe(take(1)).subscribe(res => {
                this.districtList = res || []
                this.isLoading = false;
            }, err => {
                this.isLoading = false;
                this.districtList = []
            })
        } else {
            this.filters.district = null;
            this.districtList = []
        }
        this.isValid = true;

    }
    loadCrops() {
        if (this.filters?.soil) {
            this.marketService.loadCrops(this.filters?.soil).pipe(take(1)).subscribe((res: any) => {
                this.commodityList = res?.commodities || []
                this.isLoading = false;
            }, err => {
                this.isLoading = false;
                this.commodityList = []
            })
        } else {
            this.filters.commodity = null;
            this.commodityList = []
        }
        this.isValid = true;

    }
    onChangesFiled() {
        this.isValid = true;

    }

    getProceMonthWise() {
        let payload = {
            State: this.filters.state,
            District: this.filters.district,
            Commodity: this.filters.commodity,
        }
        let payload2 = {
            State: this.filters.state,
            District: this.filters.district,
            Commodity: this.filters.commodity,
            Date: this.selectedDate
        }
        this.isLoadingPrediction = true;
        let input1 = this.marketService.getProceMonthWise(payload);
        let input2 = this.marketService.getProceDateWise(payload2);


        forkJoin([input1, input2]).pipe(take(1)).subscribe((res: any) => {
            this.predictions = res[0] || [];
            this.datePrediction = res[1]
            this.isLoadingPrediction = false;
        }, err => {
            this.predictions = []
            this.isLoadingPrediction = false;
             this.datePrediction = ''
            this.isError = true;

        })
    }
    getProceDate() {
        let payload = {
            State: this.filters.state,
            District: this.filters.district,
            Commodity: this.filters.commodity,
            Date: this.selectedDate
        }
        this.isLoadingPrediction = true;
        this.marketService.getProceDateWise(payload).pipe(take(1)).subscribe(res => {
            this.datePrediction = res
        }, err => {
            this.datePrediction = ''
            this.isError = true;
        })
    }
}
