import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  NgApexchartsModule,
  ApexTheme
} from "ng-apexcharts";
import { Transaction } from '../transaction-row/transaction-row.component';

export interface ChartOptions {
  series: ApexNonAxisChartSeries;
  title: ApexTitleSubtitle;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions,
  apexTheme: ApexTheme
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NgApexchartsModule,
    HttpClientModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})

export class CategoriesComponent implements OnInit, OnChanges {
  @ViewChild('chart') chart!: ChartComponent;
  @Input() changed: boolean = false;
  @Input() transactions?: Transaction[] | null;
  chartOptions!: Partial<ChartOptions>
  labels: string[] = [];
  constructor() { }
  hasDebitTransactions = true;

  ngOnInit(): void {
    if (this.transactions && this.transactions!.length > 0) {
      this.hasDebitTransactions = this.transactions.find(t => t.type == 'debit') ? true : false;
      this.transactions = this.transactions.map(t => {
        t.amount = t.amount.toString().replaceAll(/[\R$]/g, '').trim();

        return t
      })
      let amounts: number[] = []
      let labels: string[] = []
      this.transactions.forEach((r) => {
        if (r.type == 'debit') {
          let category = r.category.charAt(0).toUpperCase() + r.category.slice(1);
          if (labels.indexOf(category) > -1 && labels.length > 0) {
            amounts[labels.indexOf(category)] += Math.abs(Number(r.amount))
          } else {
            labels.push(category);
            amounts.push(Math.abs(Number(r.amount)))
          }
        }
      })

      this.labels = labels;
      this.createChart(amounts)
    }
  }

  ngOnChanges(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
    if (this.changed == true && this.transactions && this.transactions!.length > 0) {
      this.hasDebitTransactions = this.transactions.find(t => t.type == 'debit') ? true : false;
      this.transactions = this.transactions.map(t => {
        t.amount = t.amount.toString().replaceAll(/[\R$]/g, '').trim();

        return t
      })
      let amounts: number[] = []
      let labels: string[] = []
      this.transactions.forEach((r) => {
        if (r.type == 'debit') {
          let category = r.category.charAt(0).toUpperCase() + r.category.slice(1);
          if (labels.indexOf(category) > -1 && labels.length > 0) {
            amounts[labels.indexOf(category)] += Math.abs(Number(r.amount))
          } else {
            labels.push(category);
            amounts.push(Math.abs(Number(r.amount)))
          }
        }
      })

      this.labels = labels;
      this.createChart(amounts)
    }
  }

  createChart(series: number[]) {
    this.chartOptions = {
      series: series,
      chart: {
        height: 250,
        type: "donut",
        foreColor: "#fff",
      },
      title: {
        text: "Spending by categories",
        style: {
          fontFamily: 'Poppins',
          fontWeight: '600',
          color: '#fff'
        }
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: true,
          color: "#000",
          opacity: 1,
          left: -0.5
        },
        formatter: (val) => {
          return parseFloat(val.toString()).toFixed(2) + '%'
        },
      },
      apexTheme: {
        palette: 'palette10'
      },
      plotOptions: {
        pie: {
          customScale: 0.9,
        },
      }
    }
  }
}