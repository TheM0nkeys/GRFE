import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdbFormsModule,
    MdbCheckboxModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  readonly loginBackgrounds = [
    'assets/login/Pasted Image 3.png',
    'assets/login/usina-itaipu-1.jpg',
    'assets/login/usina-itaipu-2.jpg'
  ];
  backgroundImage = '';
  private backgroundTimer?: ReturnType<typeof setInterval>;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const initialIndex = Math.floor(Math.random() * this.loginBackgrounds.length);
    this.backgroundImage = this.loginBackgrounds[initialIndex];
    this.backgroundTimer = setInterval(() => {
      const currentIndex = this.loginBackgrounds.indexOf(this.backgroundImage);
      this.backgroundImage = this.loginBackgrounds[(currentIndex + 1) % this.loginBackgrounds.length];
    }, 9000);

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [true]
    });
  }

  ngOnDestroy(): void {
    if (this.backgroundTimer) clearInterval(this.backgroundTimer);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      localStorage.setItem('grfe.usuario.nome', this.loginForm.value.username);
      this.router.navigate(['/navbar/dashboard']);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

}
