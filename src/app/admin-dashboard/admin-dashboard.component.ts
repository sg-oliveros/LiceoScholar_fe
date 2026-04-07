import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('activityChart') private chartCanvas!: ElementRef;
  // Add a second ViewChild for the Polar Chart
  @ViewChild('polarChart') private polarCanvas!: ElementRef;

  ngAfterViewInit() {
    // 1. The existing Bar Chart (Bottom Section)
    this.renderBarChart();
    
    // 2. The new Polar Area Chart (Replacing the Pie Chart)
    this.renderPolarChart();
  }

  renderPolarChart() {
    const data = {
      labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
      datasets: [{
        label: 'My First Dataset',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ]
      }]
    };

    new Chart(this.polarCanvas.nativeElement, {
      type: 'polarArea',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: { display: true },
            ticks: { display: false } // Keeps it clean like your design
          }
        },
        plugins: {
          legend: {
            position: 'right', // Moves labels to the side like your screenshot
            labels: { boxWidth: 12, font: { size: 10 } }
          }
        }
      }
    });
  }

  renderBarChart() {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
          data: [65, 35, 50, 25, 20, 5, 5, 5, 5],
          backgroundColor: '#8b0000',
          borderRadius: 3,
          barThickness: 35
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { display: false } },
          y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { display: false } }
        }
      }
    });
  }
}
