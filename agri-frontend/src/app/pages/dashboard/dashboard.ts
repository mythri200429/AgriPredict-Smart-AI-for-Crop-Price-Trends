import { Component, OnInit } from '@angular/core';
import { MarketService } from '../service/market.service';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-market',
  imports: [
    FormsModule,
    CommonModule,
    TableModule,
    SelectModule,
    ButtonModule,
    ChartModule,
    CardModule,
    ProgressSpinnerModule,

  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  originalData: any[] = [];
  filteredData: any[] = [];
  date = new Date();
  isLoading = false;

  stateList: any[] = [];
  districtList: any[] = [];
  marketList: any[] = [];
  commodityList: any[] = [];

  filters = {
    state: null,
    district: null,
    market: null,
    commodity: null
  };

  totalRecords = 0;
  totalStates = 0;
  totalMarkets = 0;
  totalCommodities = 0;

  lineChartData: any;
  pieChartData: any;
  barChartData: any;

  constructor(private api: MarketService, private router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.api.getMarketRates().subscribe((res) => {
      this.originalData = res.records;
      //this.filteredData = [...this.originalData];

      this.totalRecords = this.originalData.length;
      this.totalStates = new Set(this.originalData.map(x => x.state)).size;
      this.totalMarkets = new Set(this.originalData.map(x => x.market)).size;
      this.totalCommodities = new Set(this.originalData.map(x => x.commodity)).size;

      this.stateList = [...new Set(this.originalData.map(x => x.state))].map(a => ({ name: a }));
      this.commodityList = [...new Set(this.originalData.map(x => x.commodity))].map(a => ({ name: a }));
      this.filteredData = this.originalData.filter(r => r.modal_price && !isNaN(+r.modal_price));

      this.createLineChart();
      this.createPieChart();
      this.createBarChart();
      this.isLoading = false;

      //this.generateCharts();
    }, err => {
      this.isLoading = false;
    });

  }

  // When State changes → load districts
  onStateChange() {
    const filtered = this.originalData.filter(x => x.state === this.filters.state);

    this.districtList = [...new Set(filtered.map(x => x.district))].map(a => ({ name: a }));
    this.filters.district = null;

    this.marketList = [];
    this.filters.market = null;

  }

  // When District changes → load markets
  onDistrictChange() {
    const filtered = this.originalData.filter(x =>
      x.state === this.filters.state &&
      x.district === this.filters.district
    );

    this.marketList = [...new Set(filtered.map(x => x.market))].map(a => ({ name: a }));
    this.filters.market = null;
  }
  goToliveRatePage() {
    this.router.navigate(['/currentrate'])
  }
  createLineChart() {
    const sorted = [...this.filteredData].sort((a, b) => {
      // assuming arrival_date is dd/mm/yyyy — convert to Date
      const da = a.arrival_date.split('/').reverse().join('-');
      const db = b.arrival_date.split('/').reverse().join('-');
      return new Date(da).getTime() - new Date(db).getTime();
    });

    this.lineChartData = {
      labels: sorted.map(r => r.arrival_date),
      datasets: [
        {
          label: 'Modal Price',
          data: sorted.map(r => +r.modal_price),
          fill: false,
          tension: 0.4,
          borderColor: '#42A5F5',

        }
      ]
    };
  }

  createPieChart() {
    // count by commodity
    const counts = this.filteredData.reduce((acc, r) => {
      acc[r.commodity] = (acc[r.commodity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.pieChartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            '#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#29B6F6', '#FF7043'
          ]
        }
      ]
    };
  }

  createBarChart() {
    // Example: average modal price per commodity
    const grouped: Record<string, number[]> = {};

    this.filteredData.forEach(r => {
      const c = r.commodity;
      const price = +r.modal_price;
      if (!grouped[c]) grouped[c] = [];
      grouped[c].push(price);
    });

    const labels = Object.keys(grouped);
    const avgPrices = labels.map(c => {
      const arr = grouped[c];
      return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2);
    });

    this.barChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Avg Modal Price',
          data: avgPrices,
          backgroundColor: '#66BB6A'
        }
      ]
    };
  }
}
