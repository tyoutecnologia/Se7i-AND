import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="flex h-screen m-0 p-0 box-border overflow-hidden">
      <!-- Sidebar -->
      <app-sidebar class="w-[400px]"></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col m-0 p-0 box-border">
        <!-- Header -->
        <app-header class="w-full"></app-header>

        <!-- Page Content -->
        <main class="flex-1 bg-gray-100 m-0 box-border overflow-auto">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class LayoutComponent {}
