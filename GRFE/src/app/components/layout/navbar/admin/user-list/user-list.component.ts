import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';

interface Usuario {
  nome: string;
  iniciais: string;
  email: string;
  perfil: 'Administrador' | 'Usuário';
  equipe: string;
  setor: string;
}

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

  constructor(private readonly formBuilder: FormBuilder) {
    this.formularioUsuario = this.formBuilder.nonNullable.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      perfil: ['Usuário' as Usuario['perfil'], Validators.required],
      equipe: ['', Validators.required],
      setor: ['', Validators.required]
    });
  }

  usuarios: Usuario[] = [
    {
      nome: 'Carlos Mendes',
      iniciais: 'CM',
      email: 'admin@itaipu.gov.br',
      perfil: 'Administrador',
      equipe: 'Alpha',
      setor: 'TI & Sistemas'
    },
    {
      nome: 'Ana Rodrigues',
      iniciais: 'AR',
      email: 'ana@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Beta',
      setor: 'Geração'
    },
    {
      nome: 'Pedro Souza',
      iniciais: 'PS',
      email: 'pedro@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Alpha',
      setor: 'Transmissão'
    },
    {
      nome: 'Fernanda Lima',
      iniciais: 'FL',
      email: 'fernanda@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Gamma',
      setor: 'Manutenção Elétrica'
    },
    {
      nome: 'Rafael Torres',
      iniciais: 'RT',
      email: 'rafael@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Delta',
      setor: 'Manutenção Mecânica'
    },
    {
      nome: 'Juliana Castro',
      iniciais: 'JC',
      email: 'juliana@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Beta',
      setor: 'Subestação'
    },
    {
      nome: 'Marcos Oliveira',
      iniciais: 'MO',
      email: 'marcos@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Epsilon',
      setor: 'Segurança'
    },
    {
      nome: 'Lucia Ferreira',
      iniciais: 'LF',
      email: 'lucia@itaipu.gov.br',
      perfil: 'Usuário',
      equipe: 'Gamma',
      setor: 'Civil'
    }
  ];

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

  novoUsuario(): void {
    this.usuarioEmEdicao = null;
    this.formularioUsuario.reset({
      nome: '',
      email: '',
      perfil: 'Usuário',
      equipe: '',
      setor: ''
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
      setor: usuario.setor
    });
    this.formularioAberto = true;
  }

  salvarUsuario(): void {
    if (this.formularioUsuario.invalid) {
      this.formularioUsuario.markAllAsTouched();
      return;
    }

    const dados = this.formularioUsuario.getRawValue();
    const usuarioAtualizado: Usuario = {
      ...dados,
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

    const confirmar = confirm(
      `Deseja realmente remover ${usuario.nome}?`
    );

    if (!confirmar) {
      return;
    }

    this.usuarios = this.usuarios.filter(
      item => item !== usuario
    );
  }

}
