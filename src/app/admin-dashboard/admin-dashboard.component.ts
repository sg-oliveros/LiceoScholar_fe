import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { DashboardService } from '../services/dashboard.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  providers: [DashboardService]
})
export class AdminDashboardComponent implements AfterViewInit {
  @ViewChild('activityChart') private chartCanvas!: ElementRef;
  // Add a second ViewChild for the Polar Chart
  @ViewChild('polarChart') private polarCanvas!: ElementRef;

  collegeData: any[] = [];
  totalUsers: number = 0;
  totalActiveUsers: number = 0;
  polarChartInstance: Chart | null = null;
  barChartInstance: Chart | null = null;

  constructor(
    private dashboardService: DashboardService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    // Only render charts on browser side
    if (isPlatformBrowser(this.platformId)) {
      // 1. The existing Bar Chart (Bottom Section)
      this.renderBarChart();
      
      // 2. The new Polar Area Chart (Replacing the Pie Chart)
      this.loadCollegeDataAndRenderPolarChart();
    }
  }

  loadCollegeDataAndRenderPolarChart() {
    this.dashboardService.getUsersByCollege().subscribe({
      next: (data) => {
        console.log('College data received:', data);
        this.collegeData = data;
        console.log('Processed collegeData:', this.collegeData);
        this.calculateTotals();
        this.renderPolarChart();
      },
      error: (error) => {
        console.error('Error fetching college data:', error);
        // Fallback to default data if API fails
        this.collegeData = [
          { CollegeName: 'College of Engineering & Architecture', Total_Users: 85 },
          { CollegeName: 'College of Arts & Sciences', Total_Users: 120 },
          { CollegeName: 'College of Business Administration', Total_Users: 95 },
          { CollegeName: 'College of Education', Total_Users: 65 },
          { CollegeName: 'College of Nursing', Total_Users: 45 },
          { CollegeName: 'College of Computer Studies', Total_Users: 110 },
          { CollegeName: 'College of Law', Total_Users: 35 }
        ];
        console.log('Using fallback data:', this.collegeData);
        this.calculateTotals();
        this.renderPolarChart();
      }
    });
  }

  calculateTotals() {
    console.log('calculateTotals called with collegeData:', this.collegeData);
    console.log('collegeData length:', this.collegeData?.length);
    
    if (this.collegeData && this.collegeData.length > 0) {
      console.log('Processing college data for totals...');
      this.collegeData.forEach((college, index) => {
        console.log(`College ${index}:`, college);
      });
      
      this.totalUsers = this.collegeData.reduce((sum, college) => {
        const users = Number(college.Total_Users);
        console.log(`Adding ${college.CollegeName} users:`, users);
        return sum + users;
      }, 0);
      
      // Calculate active users (assuming users with > 0 are active)
      this.totalActiveUsers = this.collegeData
        .filter(college => Number(college.Total_Users) > 0)
        .reduce((count, college) => count + 1, 0);
      
      console.log('Calculated totals - Total Users:', this.totalUsers, 'Active Users:', this.totalActiveUsers);
    } else {
      console.log('No college data available, setting totals to 0');
      this.totalUsers = 0;
      this.totalActiveUsers = 0;
    }
  }

  renderPolarChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    console.log('renderPolarChart called with collegeData:', this.collegeData);
    
    // Temporarily use hardcoded test data to isolate the issue
    const testData = [
      { CollegeName: 'College of Engineering & Architecture', Total_Users: 85 },
      { CollegeName: 'College of Arts & Sciences', Total_Users: 120 },
      { CollegeName: 'College of Business Administration', Total_Users: 95 },
      { CollegeName: 'College of Education', Total_Users: 65 },
      { CollegeName: 'College of Nursing', Total_Users: 45 },
      { CollegeName: 'College of Computer Studies', Total_Users: 110 },
      { CollegeName: 'College of Law', Total_Users: 35 }
    ];
    
    const dataToUse = this.collegeData.length > 0 ? this.collegeData : testData;
    
    console.log('Using data:', dataToUse);
    
    const labels = dataToUse.map(college => college.CollegeName);
    const data = dataToUse.map(college => college.Total_Users);
    
    console.log('Labels:', labels);
    console.log('Data:', data);
    console.log('Data length:', data.length);
    
    // Generate colors for each college
    const backgroundColors = [
      'rgb(255, 99, 132)',
      'rgb(75, 192, 192)',
      'rgb(255, 205, 86)',
      'rgb(201, 203, 207)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)'
    ];

    // Validate and process data values
    const validData = data.map(val => {
      const num = Number(val);
      if (isNaN(num)) {
        console.warn('Invalid number value:', val, 'setting to 0');
        return 0;
      }
      if (num < 0) {
        console.warn('Negative value:', val, 'setting to 0');
        return 0;
      }
      return num; // Keep the actual value, including zeros
    });
    
    console.log('Original data:', data);
    console.log('Validated data:', validData);
    console.log('Data range:', Math.min(...validData), 'to', Math.max(...validData));

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Users by College',
        data: validData,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderWidth: 1,
        borderColor: '#fff'
      }]
    };

    console.log('Chart data object:', chartData);
    console.log('Chart dataset data:', chartData.datasets[0].data);
    console.log('Chart labels:', chartData.labels);

    // Destroy existing chart if it exists
    if (this.polarChartInstance) {
      this.polarChartInstance.destroy();
    }

    console.log('Creating new chart...');
    this.polarChartInstance = new Chart(this.polarCanvas.nativeElement, {
      type: 'polarArea',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 10,
            bottom: 40,
            left: 10,
            right: 10
          }
        },
        scales: {
          r: {
            grid: { display: true },
            ticks: { display: false },
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: { 
              boxWidth: 10, 
              font: { size: 9 },
              padding: 10,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return context.label + ': ' + context.parsed + ' users';
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
    
    console.log('Chart created successfully:', this.polarChartInstance);
  }

  renderBarChart() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Destroy existing chart if it exists
    if (this.barChartInstance) {
      this.barChartInstance.destroy();
    }

    this.barChartInstance = new Chart(this.chartCanvas.nativeElement, {
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
