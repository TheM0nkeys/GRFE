import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../models/usuario';
import { UsuarioServiceService } from '../../../../services/usuario-service.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  usuarios: Usuario[] = [];
  especialidades: { id: number; nome: string }[] = [];
  carregando = false;
  erro = '';
  formularioAberto = false;
  usuarioEmEdicao: Usuario | null = null;
  dados: Partial<Usuario> = { nome: '', matricula: '', email: '', especialidadeIds: [] };

  constructor(private readonly usuarioService: UsuarioServiceService) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';
    this.usuarioService.listarUsuarios().subscribe({ next: (usuarios) => { this.usuarios = usuarios; this.carregando = false; }, error: (error) => this.mostrarErro(error) });
    this.usuarioService.listarEspecialidades().subscribe({ next: (especialidades) => this.especialidades = especialidades, error: (error) => this.mostrarErro(error) });
  }

  novoUsuario(): void {
    this.usuarioEmEdicao = null;
    this.dados = { nome: '', matricula: '', email: '', especialidadeIds: [] };
    this.formularioAberto = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEmEdicao = usuario;
    this.dados = { ...usuario, especialidadeIds: usuario.especialidadeIds ?? [] };
    this.formularioAberto = true;
  }

  salvarUsuario(): void {
    if (!this.dados.nome?.trim() || !this.dados.matricula?.trim() || !this.dados.email?.trim() || !this.dados.especialidadeIds?.length) {
      this.erro = 'Nome, matrícula, e-mail e pelo menos uma especialidade são obrigatórios.';
      return;
    }

    const operacao = this.usuarioEmEdicao?.id
      ? this.usuarioService.atualizarUsuario(this.usuarioEmEdicao.id, this.dados)
      : this.usuarioService.criarUsuario(this.dados);
    operacao.subscribe({ next: () => { this.cancelar(); this.carregar(); }, error: (error) => this.mostrarErro(error) });
  }

  removerUsuario(usuario: Usuario): void {
    if (!usuario.id) return;
    void Swal.fire({ icon: 'warning', title: 'Remover usuário?', text: `Deseja remover ${usuario.nome}?`, showCancelButton: true, confirmButtonText: 'Remover', cancelButtonText: 'Cancelar' }).then((resultado) => {
      if (resultado.isConfirmed) this.usuarioService.excluirUsuario(usuario.id!).subscribe({ next: () => this.carregar(), error: (error) => this.mostrarErro(error) });
    });
  }

  cancelar(): void {
    this.formularioAberto = false;
    this.usuarioEmEdicao = null;
    this.dados = { nome: '', matricula: '', email: '', especialidadeIds: [] };
  }

  private mostrarErro(error: { error?: { mensagem?: string }; message?: string }): void {
    this.carregando = false;
    this.erro = error.error?.mensagem ?? error.message ?? 'Não foi possível carregar os usuários.';
  }
}
