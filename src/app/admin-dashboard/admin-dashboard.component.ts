import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';
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
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  currentUser: any;
  currentUserId: number | null = null;
  admin = signal<any>({});
  
  ngOnInit(): void {
    this.cdr.detectChanges();
    this.loadUserData();
    this.loadStats();
    this.loadbarChartData();
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
      type: 'bar',
      data: {
        labels: labels.length ? labels : ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        datasets: [{
          data: data.length ? data : [65, 35, 50, 25, 20, 5, 5, 5, 5],
          backgroundColor: '#8b0000',
          borderRadius: 3
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
    this.authService.getMe().subscribe({
      next: (response) => {
        
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
}
