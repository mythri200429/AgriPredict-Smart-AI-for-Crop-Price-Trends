import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { MarketService } from '../service/market.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { SharedModule } from 'primeng/api'; // Often

@Component({
  selector: 'app-cropdetails',
  imports: [CardModule, CommonModule, TableModule, DialogModule, ButtonModule,TabsModule,SharedModule],
  templateUrl: './cropdetails.html',
  styleUrl: './cropdetails.scss'
})
export class Cropdetails implements OnInit {
  crops: any[] = [];
  currentDate = new Date().toLocaleDateString();
  private marketService = inject(MarketService);

  showDialog = false;
  selectedCrop: any = null;


  ngOnInit() {
    this.marketService.getAllCrops().subscribe((res: any) => {
      this.crops = res;
    });
  }

  openDetails(crop: any) {
    this.selectedCrop = crop;
    this.showDialog = true;
  }
}
