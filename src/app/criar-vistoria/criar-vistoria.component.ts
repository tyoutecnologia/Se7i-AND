import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-criar-vistoria',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './criar-vistoria.component.html',
  styleUrls: ['./criar-vistoria.component.css'],
})
export class CriarVistoriaComponent implements OnInit {
  servicos: Array<{ id: string; descricao: string; valor: number }> = [];
  selectedServico: string = '';
  selectedFile: File | null = null;
  pdfPreviewUrl: string | null = null; // Define a propriedade para o preview do PDF
  municipioDestinoId: string = '247d536a-e868-46c8-ab05-5b65a34cbc5a';
  usuarioId: string = '';
  isLoading: boolean = false;
  nomeCondutor: string = '';
  cpfCondutor: string = '';
  telefoneCondutor: string = '';
  emailCondutor: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.usuarioId = this.authService.getUser()?.id || '';
    this.fetchServicos();
  }

  fetchServicos(): void {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error(
        'Você não está autenticado. Faça login novamente.',
        'Erro',
      );
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .get<
        { id: string; descricao: string; valor: number }[]
      >('http://se7i2.ddns.net:3090/servicos', { headers })
      .subscribe({
        next: (response) => {
          this.servicos = response;
        },
        error: (error) => {
          this.toastr.error(
            'Erro ao carregar os serviços. Tente novamente.',
            'Erro',
          );
        },
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'application/pdf') {
        this.toastr.error(
          'Por favor, selecione um arquivo PDF válido.',
          'Erro',
        );
      } else {
        this.selectedFile = file;

        // Gera uma URL para o preview do PDF
        const fileReader = new FileReader();
        fileReader.onload = () => {
          this.pdfPreviewUrl = fileReader.result as string;
        };
        fileReader.readAsDataURL(file);
      }
    }
  }

  submitForm(): void {
    if (
      !this.selectedServico ||
      !this.selectedFile ||
      !this.nomeCondutor ||
      !this.cpfCondutor ||
      !this.telefoneCondutor ||
      !this.emailCondutor
    ) {
      this.toastr.error('Preencha todos os campos antes de enviar.', 'Erro');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      this.toastr.error(
        'Você não está autenticado. Faça login novamente.',
        'Erro',
      );
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('arquivos', this.selectedFile!);
    formData.append('cidade_destino_id', this.municipioDestinoId);
    formData.append('usuario_id', this.usuarioId);
    formData.append('servico_id', this.selectedServico);

    const metadados = [
      {
        nome_arquivo: this.selectedFile!.name,
        tipo_arquivo: 'LAUDO',
      },
    ];
    formData.append('arquivosMetadados', JSON.stringify(metadados));

    const condutor = {
      nome: this.nomeCondutor,
      cpf: this.cpfCondutor.replace(/\D/g, ''),
      telefone: this.telefoneCondutor.replace(/\D/g, ''),
      email: this.emailCondutor,
    };
    formData.append('condutor', JSON.stringify(condutor));

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post('http://se7i2.ddns.net:3090/vistorias', formData, { headers })
      .subscribe({
        next: (response: any) => {
          if (response.status === 201) {
            this.toastr.success('Vistoria cadastrada com sucesso!', 'Sucesso');
            this.reloadComponent();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.toastr.error(
            'Erro ao cadastrar a vistoria. Tente novamente.',
            'Erro',
          );
          this.isLoading = false;
        },
      });
  }

  reloadComponent(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
