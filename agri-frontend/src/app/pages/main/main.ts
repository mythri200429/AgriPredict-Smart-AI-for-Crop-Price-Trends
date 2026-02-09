
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, interval, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, take } from 'rxjs/operators';

import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MarketService } from '../service/market.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-main',
  imports: [
    
    CommonModule, 
    ChartModule, 
    CardModule, 
    FormsModule,
    TableModule,
    SelectModule,
    ButtonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
// table data
  marketData: any[] = [];
  loading = false;
  totalRecords = 0;




  // pagination
  limit = 50;
  offset = 0;



  // chart
  chartLabels: string[] = [];
  chartData: number[] = [];
  chartLoading = false;


  filters: any = {
    state: null,
    district: null,
    commodity: null
  };

  stateList: any = [];
  districtList: any = [];
  marketList: any = [];
  commodityList: any = [];

  originalData: any[] = [];


  constructor(private marketService: MarketService) { }

  ngOnInit(): void {
    // initial load
    this.getStates();
    this.getAllCropsList();
    this.loadData();
  }

  loadData(showLoader = true) {
    if (showLoader) this.loading = true;

    const opts = {
      state: this.filters.state || undefined,
      district: this.filters.district || undefined,
      commodity: this.filters.commodity || undefined,
      limit: this.limit,
      offset: this.offset
    };

    this.marketService.getMarketRates(opts).pipe(
      catchError(err => {
        console.error('API error', err);
        return of({ records: [], total: 0 });
      })
    ).subscribe(res => {
      this.marketData = res.records || [];
      this.totalRecords = res.total || (this.marketData.length + this.offset);
      this.originalData = [...this.marketData]
      this.loading = false;
    });
  }

  // pagination helpers
  nextPage() {
    this.offset += this.limit;
    this.loadData();
  }
  prevPage() {
    this.offset = Math.max(0, this.offset - this.limit);
    this.loadData();
  }

  // CSV export of currently visible rows
  downloadExcel() {
    if (!this.marketData || this.marketData.length === 0) return;
    const columns = ['state', 'district', 'market', 'commodity', 'variety', 'grade', 'arrival_date', 'min_price', 'max_price', 'modal_price'];
    const header = columns.join(',') + '\r\n';
    const rows = this.marketData.map(r => {
      return columns.map(c => {
        const v = r[c] ?? '';
        // escape quotes
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\r\n');

    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `market_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Chart: show modal price trend for selected single market+commodity
  loadChartFor(row: any, days = 30) {
    if (!row) return;
    this.chartLoading = true;
    const market = row.market;
    const commodity = row.commodity;
    this.marketService.getMarketTimeSeries(market, commodity, days).pipe(
      catchError(err => {
        console.error('Chart API error', err);
        return of({ records: [] });
      })
    ).subscribe(res => {
      const records = (res.records || []).slice().reverse(); // oldest-first
      this.chartLabels = records.map((r: any) => r.arrival_date);
      this.chartData = records.map((r: any) => {
        const v = r.modal_price ?? r.avg_price ?? r.median_price ?? r.max_price ?? null;
        return v ? Number(v) : null;
      });
      this.chartLoading = false;
    });
  }

  // helper to format numbers (optional)
  formatPrice(v: any) {
    if (v == null || v === '') return '-';
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString();
  }

  loadDistricts() {
    if (this.filters.state) {
      this.marketService.loadDistricts(this.filters.state).pipe(take(1)).subscribe((res) => {
        this.districtList = res || []
      }, err => {
        this.districtList = []
      })
    } else {
      this.districtList = []
    }
  }

  loadMarkets() {
    this.marketList = [...new Set(this.marketData.filter(
      x => (!this.filters.district || x.district === this.filters.district)
    ).map(x => x.market))].map(x => ({ label: x, value: x }));
  }

  applyFilters() {
    this.loadData();
  }

  resetFilters() {
    this.loadData();
  }

  getStates() {
    this.marketService.getStates().pipe(take(1)).subscribe(res => {
      this.stateList = res || []
      this.districtList = [];
    }, err => {
      this.districtList = [];
      this.stateList = [];
    })
  }
  getAllCropsList() {
    this.marketService.getAllCropsList().pipe(take(1)).subscribe(res => {
      this.commodityList = res || []
    }, err => {
      this.commodityList = [];
    })
  }
}
