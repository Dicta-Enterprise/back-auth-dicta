import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateProfileDto } from 'src/application/dto/create-profile.dto';
import { CreateProfileUseCase } from 'src/application/use-cases/create-profile.use-case';
import { JwtPayload } from 'src/core/services/auth/jwtPayload';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@Controller('perfil')
@UseGuards(jwtAuthGuard)
export class PerfilController {
     constructor(private readonly createProfileUseCase: CreateProfileUseCase ) {}

    @Post('crear')
    async create(@CurrentUser() userId: JwtPayload, @Body() dto: CreateProfileDto) {
        
        const user = Number(userId.sub);

        const result = await this.createProfileUseCase.execute(user, dto);
        
        if (result.isFailure) {
        throw new HttpException(result.error.message, HttpStatus.BAD_REQUEST);
        }
        const perfil = result.getValue();
        return {
        data: {
            nombre: perfil.nombre,
            idusuario: perfil.idusuario,
            imageurl: perfil.imageurl
        },
        message: 'Perfil creado con éxito'
    };       
}
}
