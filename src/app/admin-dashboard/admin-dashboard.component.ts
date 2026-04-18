import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
import { ApplicationsService } from '../services/applications.service';
import { DailyApplicationStat, DashboardService} from '../services/dashboard.service';
import { AuthService } from '../services/auth.service';
import { ProfilePhotoComponent } from "../components/profile-photo/profile-photo.component";

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminSidebarComponent, ProfilePhotoComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{
  @ViewChild('activityChart') private chartCanvas!: ElementRef;
  @ViewChild('polarChart') private polarCanvas!: ElementRef;

  collegeData: any[] = [];
  totalUsers: number = 0;
  totalActiveUsers: number = 0;
  dailyApplications: DailyApplicationStat[] = [];
  polarChartInstance: Chart | null = null;
  barChartInstance: Chart | null = null;

  constructor(
    private dashboardService: DashboardService,
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  currentYear: string = '';
  currentSemester: string = '';

  currentUser: any;
  currentUserId: number | null = null;
  admin = signal<any>({});
  
  ngOnInit(): void {
    this.cdr.detectChanges();
    this.loadUserData();
    this.loadStats();
    this.loadbarChartData();
    this.loadpieChartData();
  }

  loadpieChartData(): void {
    this.dashboardService.getUsersByCollegeStats().subscribe({
      next: (response: any[]) => {
        this.collegeData = response;
        
        this.renderPieChart();
      },
      error: (err) => {
        console.error('Failed to load college stats:', err);
      }
    });
  }
  renderPieChart(): void {
    this.polarChartInstance?.destroy();

    // Filter out colleges with 0 users and prepare data
    const activeColleges = this.collegeData.filter(item => item.Total_Users > 0);
    
    // College color mapping - each college has a fixed color
    const collegeColors: { [key: string]: string } = {
      'College of Arts and Science': 'rgba(139, 0, 0, 0.8)',
      'School of Business, Management and Accountancy': 'rgba(255, 99, 132, 0.8)',
      'College of Criminal Justice': 'rgba(54, 162, 235, 0.8)',
      'College of Engineering': 'rgba(255, 206, 86, 0.8)',
      'College of Information Technology': 'rgba(75, 192, 192, 0.8)',
      'College of Medical Laboratory Science': 'rgba(153, 102, 255, 0.8)',
      'Conservatory of Music, Theater and Dance': 'rgba(255, 159, 64, 0.8)',
      'College of Nursing': 'rgba(199, 199, 199, 0.8)',
      'College of Dentistry': 'rgba(83, 102, 255, 0.8)',
      'College of Pharmacy': 'rgba(40, 167, 69, 0.8)',
      'College of Rehabilitation Sciences': 'rgba(220, 53, 69, 0.8)',
      'College of Radiologic Technology': 'rgba(23, 162, 184, 0.8)',
      'School of Teacher Education': 'rgba(111, 66, 193, 0.8)'
    };

    this.polarChartInstance = new Chart(this.polarCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: activeColleges.map(item => item.CollegeName),
        datasets: [{
          data: activeColleges.map(item => item.Total_Users),
          backgroundColor: activeColleges.map(item => collegeColors[item.CollegeName] || 'rgba(128, 128, 128, 0.8)'),
          borderColor: 'white',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 15,
              font: { size: 11 }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw as number;
                const total = activeColleges.reduce((sum, item) => sum + item.Total_Users, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} users (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }

  loadbarChartData(): void {
    this.dashboardService.getDailyApplicationsStats().subscribe({
      next: (response: DailyApplicationStat[]) => {
        this.dailyApplications = response;
        
        this.renderBarChart();
      },
      error: (err) => {
        console.error('Failed to load daily applications stats:', err);
      }
    });
  }

  renderBarChart(): void {
    

    

    this.barChartInstance?.destroy();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    console.log('oneYearAgo', oneYearAgo);
 
    

    const filteredData = this.dailyApplications

      .filter(d => new Date(d.Date) >= oneYearAgo)
      .slice(0, 365);

    const labels = filteredData.map(d => d.Date);
    const data = filteredData.map(d => d.Total_Applications);

    const maxValue = Math.max(...data, 0);
    const yMax = maxValue > 0 ? Math.ceil(maxValue * 1.2) : 10;

    this.barChartInstance = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels.length ? labels : [],
        datasets: [{
          data: data.length ? data : [],
          borderColor: '#8b0000',
          backgroundColor: 'rgba(139, 0, 0, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          pointBackgroundColor: '#8b0000'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              display: true,
              callback: (_value, index) => {
                const date = new Date(filteredData[index]?.Date);
                return date.toLocaleString('default', { month: 'short', day: 'numeric'});
              }
            }
          },
          y: {
            beginAtZero: true,
            max: yMax,
            grid: { color: '#f0f0f0' },
            ticks: { display: true, stepSize: 10 }
          }
        }
      }
    });
  }
  
  loadStats(): void {
    this.dashboardService.getScholarStats().subscribe({
      next: (response) => {
        console.log('Scholar stats:', response);
        this.admin.set({
          ...this.admin(),
          activeScholarships: response.Active_Scholarships,
          totalUsers: response.Total_Users
        });
      },
      error: (err) => {
        console.error('Failed to load scholar stats:', err);
      }
    });
  }
  loadUserData(): void {
    console.log('loadUserData() called');
    this.authService.getMe().subscribe({
      next: (response) => {
        console.log('loadUserData() success, calling loadSchoolyear()');
        this.loadSchoolyear();
        
        const user = response.user;
        this.currentUser = user;
        
        this.currentUserId = user.UserID;
        this.admin.set({
          ...this.admin(),
          fullName: `${user.LastName}, ${user.FirstName}`
        });
       
        
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
        
      }
    });
  }
  loadSchoolyear(): void {
    console.log('loadSchoolyear() called');
    this.applicationsService.getSySem().subscribe({
      next: (response: any) => {
        console.log('Schoolyear data received:', response);
        const sySem = Array.isArray(response) ? response[0] : response;
        if (sySem && sySem.Year_start && sySem.Year_end) {
          this.currentYear = `${sySem.Year_start}-${sySem.Year_end}`;
          this.currentSemester = sySem.Semester === 1 ? '1st Sem' : '2nd Sem';
          console.log('Set currentYear:', this.currentYear, 'currentSemester:', this.currentSemester);
        } else {
          console.warn('Invalid SySem response:', response);
        }
      },
      error: (err: any) => {
        console.error('Failed to load schoolyear data:', err);
      }
    });
  }

}
