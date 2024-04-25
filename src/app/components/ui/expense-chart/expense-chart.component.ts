import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule,
} from "ng-apexcharts";
import { Transaction } from '../transaction-row/transaction-row.component';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
}

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [
    NgApexchartsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './expense-chart.component.html',
  styleUrls: ['./expense-chart.component.css']
})

export class ExpenseChartComponent implements OnChanges, OnInit {
  @Input() changed: boolean = false;
  @ViewChild('chart') chart!: ChartComponent;
  @Input() transactions?: Transaction[] | null;
  chartOptions!: Partial<ChartOptions>;
  constructor() { }

  ngOnInit(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')

    if (this.transactions && this.transactions.length > 0) {
      let date = new Date()
      let thisMonth = date.getMonth() + 1
      let thisYear = date.getFullYear()
      let daysInMonth = []
      let amounts: number[] = [];

      function getDaysInMonth(month: number, year: number) {
        return new Date(year, month, 0).getDate();
      }

      for (let i = 1; i <= getDaysInMonth(thisMonth, thisYear); i++) {
        daysInMonth.push(i);
        amounts.push(0)
      }

      this.transactions.forEach(r => {
        let trasactionsCreatedDay = new Date(r.created_at).getDate();
        amounts[trasactionsCreatedDay] += Number(r.amount);
      });

      this.createChart(amounts, daysInMonth)
    }
  }

  ngOnChanges(): void {
    this.transactions = JSON.parse(localStorage.getItem('request') || 'null')
    if (this.changed == true && this.transactions && this.transactions.length > 0) {
      let date = new Date()
      let thisMonth = date.getMonth() + 1
      let thisYear = date.getFullYear()
      let daysInMonth = []
      let amounts: number[] = [];

      function getDaysInMonth(month: number, year: number) {
        return new Date(year, month, 0).getDate();
      }

      for (let i = 1; i <= getDaysInMonth(thisMonth, thisYear); i++) {
        daysInMonth.push(i);
        amounts.push(0)
      }

      this.transactions.forEach(r => {
        let trasactionsCreatedDay = new Date(r.created_at).getDate();
        amounts[trasactionsCreatedDay] += Number(r.amount);
      });

      this.createChart(amounts, daysInMonth)
    }
  }
  createChart(amounts: number[], daysInMonth: number[]) {
    this.chartOptions = {
      series: [
        {
          name: `Gastos no mês ${new Date().getMonth() + 1}`,
          data: amounts,
          color: "#5512cb"
        }
      ],
      chart: {
        height: 250,
        type: "area",
        foreColor: "#fff"
      },
      title: {
        text: "Spendings in this month",
        style: {
          fontFamily: 'Poppins',
          fontWeight: '600',
          color: '#fff'
        }
      },
      xaxis: {
        categories: daysInMonth
      }
    };
  }
}
