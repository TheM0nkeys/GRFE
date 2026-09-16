import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../../models/usuario';

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, ReactiveFormsModule, MdbRippleModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {

  formularioUsuario;

  formularioAberto = false;
  usuarioEmEdicao: Usuario | null = null;

  readonly equipes: string[] = [];
  readonly perfis: string[] = [];
  readonly setores: string[] = [];
  readonly especialidades: Array<{ id: number; nome: string }> = [];

  constructor(private readonly formBuilder: FormBuilder) {
    this.formularioUsuario = this.formBuilder.nonNullable.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['Usuário' as Usuario['perfil'], Validators.required],
      equipe: ['', Validators.required],
      setor: ['', Validators.required],
      especialidade: ['']
    });
  }

  usuarios: Usuario[] = [];

  get quantidadeAdministradores(): number {
    return this.usuarios.filter(
      usuario => usuario.perfil === 'Administrador'
    ).length;
  }

  get quantidadeUsuarios(): number {
    return this.usuarios.filter(
      usuario => usuario.perfil === 'Usuário'
    ).length;
  }

  get perfilAtual(): string {
    return this.formularioUsuario.get('perfil')?.value ?? 'Usuário';
  }

  novoUsuario(): void {
    this.usuarioEmEdicao = null;
    this.formularioUsuario.reset({
      nome: '',
      email: '',
      perfil: 'Usuário',
      equipe: '',
      setor: '',
      especialidade: ''
    });
    this.formularioAberto = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.usuarioEmEdicao = usuario;
    this.formularioUsuario.setValue({
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      equipe: usuario.equipe,
      setor: usuario.setor,
      especialidade: usuario.especialidade ?? ''
    });
    this.formularioAberto = true;
  }

  salvarUsuario(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
    }

    const dados = this.formularioUsuario.getRawValue();

    if (dados.perfil === 'Plantonista' && !dados.especialidade) {
      this.formularioUsuario.controls.especialidade.markAsTouched();
      this.formularioUsuario.controls.especialidade.setErrors({ required: true });
      return;
    }

    const especialidadeSelecionada = this.especialidades.find((item) => item.nome === dados.especialidade);
    const usuarioAtualizado: Usuario = {
      ...dados,
      especialidade: dados.perfil === 'Plantonista' ? (especialidadeSelecionada?.nome ?? dados.especialidade) : undefined,
      especialidadeId: dados.perfil === 'Plantonista' ? (especialidadeSelecionada?.id ?? null) : undefined,
      iniciais: this.gerarIniciais(dados.nome)
    };

    if (this.usuarioEmEdicao) {
      const indice = this.usuarios.indexOf(this.usuarioEmEdicao);
      this.usuarios[indice] = usuarioAtualizado;
      this.usuarios = [...this.usuarios];
    } else {
      this.usuarios = [...this.usuarios, usuarioAtualizado];
    }

    this.cancelarFormulario();
  }

  cancelarFormulario(): void {
    this.formularioAberto = false;
    this.usuarioEmEdicao = null;
    this.formularioUsuario.reset();
  }

  private gerarIniciais(nome: string): string {
    return nome
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(parte => parte.charAt(0).toUpperCase())
      .join('');
  }

  removerUsuario(usuario: Usuario): void {
    void Swal.fire({
      icon: 'warning',
      title: 'Remover usuário?',
      text: `Deseja realmente remover ${usuario.nome}?`,
      showCancelButton: true,
      confirmButtonText: 'Remover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#c94444',
      reverseButtons: true
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.usuarios = this.usuarios.filter(item => item !== usuario);
      }
    });
  }

}
