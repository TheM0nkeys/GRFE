import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chamado } from '../models/chamado';
import { ChamadoService } from './chamado-service.service';

@Injectable({
  providedIn: 'root'
})
export class DashServiceService {

  constructor(private readonly chamadoService: ChamadoService) { }

  obterChamados(): Observable<Chamado[]> {
    return this.chamadoService.obterChamados();
  }
}
