import { Injectable, NotFoundException } from '@nestjs/common';
import { UbicacionUsuario } from 'src/core/entities/ubicacion-usuario/ubicacion-usuario.entity';
import { TransactionApiService } from 'src/core/services/transaction/transaction-api.service';
import { UbicacionUsuarioService } from 'src/core/services/ubicacion-usuario/ubicacion-usuario.service';
import { Result } from 'src/shared/domain/result/result';

@Injectable()
export class DetectarUbicacionPorCompraUseCase {
  constructor(
    private readonly transactionApiService: TransactionApiService,
    private readonly ubicacionUsuarioService: UbicacionUsuarioService,
  ) {}

  async execute(idusuario: number): Promise<Result<UbicacionUsuario>> {
    try {
      const ip = await this.transactionApiService.obtenerIpRegistrada(idusuario);

      if (!ip) {
        return Result.fail(
          new NotFoundException('No hay una dirección IP registrada en tus compras todavía'),
        );
      }

      const ubicacion = await this.ubicacionUsuarioService.actualizarDesdeIp(idusuario, ip);
      return Result.ok<UbicacionUsuario>(ubicacion);
    } catch (error) {
      return Result.fail(error);
    }
  }
}
