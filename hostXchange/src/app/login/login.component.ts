import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  public view = 1;
  public password = '';
  public confirmPassword = '';
  public email = '';
  public nome = '';
  public cpf = '';
  public rg = '';
  public sexo = '';
  public passaporte = '';
  public nacionalidade = '';
  public codigo = '';

  constructor(
      private service: LoginService
    , private toastr : ToastrService
    , private router: Router
  ) {}

  ngOnInit() {
  }

  login() {
    this.view = 1;
    this.password = '';
    this.confirmPassword = '';
    this.email = '';
    this.nome = '';
    this.cpf = '';
    this.rg = '';
    this.sexo = '';
    this.passaporte = '';
    this.nacionalidade = '';
  }

  cadastro() {
    this.view = 2;
    this.password = '';
    this.email = '';
  }

  redefir() {
    this.view = 3;
  }

  enviarEmail() {
    this.service.enviarEmail(this.email).subscribe({
      next: (res: any) => {
        if (res.blOk === true) {
          this.toastr.success(res.message, 'SUCESSO:');
          this.view = 4;
        } else {
          this.toastr.error(res.message, 'ERRO:');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
        this.toastr.warning('Ocorreu um erro durante o envio do email. Por favor tente novamente!', 'ATENÇÃO:');
      }
    })
  }
  
  entrar() {
    this.service.enviarEmail(this.email).subscribe({
      next: (res: any) => {
        if (res.blOk === true) {
          const user = res.user[0];
          localStorage.setItem('id', user.ID_USUARIO);
          localStorage.setItem('nome', user.NOME);
          localStorage.setItem('logado', "true");
          this.toastr.success(res.message, 'SUCESSO:');
          this.router.navigate(['/home']);
        } else {
          this.toastr.error(res.message, 'ERRO:');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
        this.toastr.warning('Ocorreu um erro durante o login. Por favor tente novamente!', 'ATENÇÃO:');
      }
    })
  }

  cadastrar() {
    let data:any = {};
    data.nome = this.nome;
    data.email = this.email;
    data.cpf = this.cpf;
    data.rg = this.rg;
    data.passaporte = this.passaporte;
    data.nacionalidade = this.nacionalidade;
    data.sexo = this.sexo;
    data.senha = this.password;

    this.service.enviarEmail(data).subscribe({
      next: (res: any) => {
        if (res.blOk === true) {
          this.toastr.success(res.message, 'SUCESSO:');
          this.view = 1;
        } else {
          this.toastr.error(res.message, 'ERRO:');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
        this.toastr.warning('Ocorreu um erro durante o cadastro. Por favor tente novamente!', 'ATENÇÃO:');
      }
    })
  }

  confirmarCodigo() {
    this.service.enviarEmail(this.codigo).subscribe({
      next: (res: any) => {
        if (res.blOk === true) {
          this.toastr.success(res.message, 'SUCESSO:');
          this.view = 5;
        } else {
          this.toastr.error(res.message, 'ERRO:');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
        this.toastr.warning('Ocorreu um erro durante a confirmação do código. Por favor tente novamente!', 'ATENÇÃO:');
      }
    })
  }

  salvarSenha() {
    this.service.enviarEmail(this.password).subscribe({
      next: (res: any) => {
        if (res.blOk === true) {
          this.toastr.success(res.message, 'SUCESSO:');
          this.view = 1;
        } else {
          this.toastr.error(res.message, 'ERRO:');
        }
      },
      error: (error) => {
        console.error('Error during login:', error);
        this.toastr.warning('Ocorreu um erro durante a redefinição de senha. Por favor tente novamente!', 'ATENÇÃO:');
      }
    })
  }
}
