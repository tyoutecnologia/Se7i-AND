import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  menuItems: Array<{ label: string; route: string; icon: string }> = [];
  roles: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.roles = JSON.parse(localStorage.getItem('roles') || '[]');

    // Configuração do menu com base nos papéis
    if (this.roles.includes('ADMIN')) {
      this.menuItems.push(
        {
          label: 'Cadastro de Detran',
          route: '/cadastro-detran',
          icon: 'mdi:account-multiple',
        },
        {
          label: 'Cadastro de Usuário AND',
          route: '/cadastro-usuario',
          icon: 'mdi:account',
        },
        {
          label: 'Cadastro de Serviço',
          route: '/cadastro-servico',
          icon: 'mdi:cog-outline',
        },
      );
    }

    if (this.roles.includes('SUPERVISOR_DETRAN')) {
      this.menuItems.push(
        {
          label: 'Vistorias Lacradas',
          route: '/dashboard',
          icon: 'quill:paper',
        },
        {
          label: 'Cadastro de Ciretran / Departamento',
          route: '/ciretran',
          icon: 'mdi:account-multiple',
        },
        {
          label: 'Cadastro de Diretor/Supervisor',
          route: '/cadastro-usuario',
          icon: 'mdi:account',
        },
        {
          label: 'Cadastro e Posto de Vistoria',
          route: '/posto-vistoria',
          icon: 'heroicons-outline:building-office',
        },
      );
    }

    if (this.roles.includes('OPERADOR_CIRETRAN')) {
      this.menuItems.push(
        {
          label: 'Vistorias Lacradas',
          route: '/dashboard',
          icon: 'quill:paper',
        },
        {
          label: 'Cadastro de Agente',
          route: '/cadastro-usuario',
          icon: 'mdi:account-badge-outline',
        },
        {
          label: 'Cadastro de Posto de Vistoria',
          route: '/cadastro-pstvistoria',
          icon: 'heroicons-outline:building-office',
        },
      );
    }

    if (this.roles.includes('OPERADOR_POSTO_VISTORIA')) {
      this.menuItems.push(
        {
          label: 'Criar Vistoria Lacrada',
          route: '/criar-vistoria',
          icon: 'ic:round-add-box',
        },
        {
          label: 'Vistorias Lacradas',
          route: '/dashboard',
          icon: 'quill:paper',
        },
        {
          label: 'Cadastro de Funcionário',
          route: '/cadastro-usuario',
          icon: 'mdi:account',
        },
      );
    }

    // Adiciona "Relatório" para todos os papéis
    this.menuItems.push({
      label: 'Relatório',
      route: '/relatorio',
      icon: 'line-md:document-report-twotone',
    });
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }
}
