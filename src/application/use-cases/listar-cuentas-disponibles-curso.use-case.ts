import { Injectable } from '@nestjs/common';
import { CuentaAsociadaService } from 'src/core/services/cuenta-asociada/cuenta-asociada.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class ListarCuentasDisponiblesCursoUseCase {
  constructor(private readonly service: CuentaAsociadaService) {}

  async execute(idpadre: number, tipoCurso: string) {
    try {
      const cuentas = await this.service.obtenerCuentasDisponiblesParaCurso(idpadre, tipoCurso);
      const disponibles = cuentas.map((c) => ({
        id: c.id,
        alias: c.alias,
        correo: c.correo,
        fechanacimiento: c.fechanacimiento,
        tipocuenta: c.tipocuenta,
      }));
      return Result.okList(disponibles);
    } catch {
      return Result.fail(new Error('Ocurrió un error desconocido al listar las cuentas disponibles.'));
    }
  }
}
