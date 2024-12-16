import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../auth.service'; // Importe o AuthService

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentRoute: string = '';
  userName: string = '';

  routeMap: { [key: string]: string } = {
    '/dashboard': 'Vistorias Lacradas',
    '/cadastro-ciretran': 'Cadastro de Ciretran / Departamento',
    '/diretor': 'Cadastro de Diretor / Supervisor',
    '/cadastro-pstvistoria': 'Cadastro de Posto de Vistoria',
    '/criar-vistoria': 'Criar Vistoria',
    '/cadastro-usuario': 'Criar Usúario',
    '/cadastro-servico': 'Cadastrar Serviço',
    '/cadastro-detran': 'Cadastro Detran',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    // Injeção do AuthService
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = this.routeMap[event.url] || 'Página Desconhecida';
      });
  }

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.userName = JSON.parse(user)?.nome || 'Usuário'; // Assume que o nome está em `user.nome`
    } else {
      this.userName = 'Usuário'; // Fallback se o usuário não estiver logado
    }
  }

  // Método para logout
  logout(): void {
    this.authService.logout(); // Chama o método de logout do AuthService
  }
}
