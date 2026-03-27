import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProfileDto } from 'src/application/dto/create-profile.dto';
import { UpdateProfileDto } from 'src/application/dto/update-profile.dto';
import { CreateProfileUseCase } from 'src/application/use-cases/create-profile.use-case';
import { GetProfilesUseCase } from 'src/application/use-cases/get-profiles.use-case';
import { UpdateProfileUseCase } from 'src/application/use-cases/update-profile.use-case';
import { JwtPayload } from 'src/core/services/auth/jwtPayload';
import { CurrentUser } from 'src/shared/decorator/current-user.decorator';
import { jwtAuthGuard } from 'src/shared/guard/jwtAuth.guard';

@ApiTags('Perfil')       
@ApiBearerAuth()
@Controller('profile')
@UseGuards(jwtAuthGuard)
export class PerfilController {
    constructor(private readonly createProfileUseCase: CreateProfileUseCase
        ,private readonly verPerfilesUseCase: GetProfilesUseCase
        ,private readonly updateProfileUseCase: UpdateProfileUseCase

     ) {}

    @Post('create')
    @ApiOperation({ summary: 'Crear perfil', description: 'Crea un nuevo perfil vinculado al usuario autenticado.' })
    @ApiResponse({ status: 201, description: 'Perfil creado con éxito.' })
    @ApiResponse({ status: 400, description: 'Error en la validación o regla de negocio.' })
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
    }  
}
@Get()
    @ApiOperation({ 
        summary: 'Listar perfiles', 
        description: 'Obtiene todos los perfiles asociados al usuario autenticado.' 
    })
    @ApiResponse({ 
        status: 200, 
        description: 'Lista obtenida con éxito.',
        schema: {
            example: {
                data: [
                    { id: 1, nombre: 'Perfil 1', idusuario: 33, idrol: 4, estado: 1, imageurl: '...' }
                ]
            }
        }
    })
    @ApiResponse({ status: 404, description: 'No se encontraron perfiles para este usuario.' })
    async verPerfiles(@CurrentUser() userId: JwtPayload) {
        const user = Number(userId.sub);
        const result = await this.verPerfilesUseCase.execute(user);
        if (result.isFailure) {
        throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
        }
        return {
        data: result.getValue(),
        message: 'Perfles obtenidos con éxito'
    };
    }
    @Patch(':id')
    @ApiOperation({ summary: 'Update profile', description: 'Updates specific fields of a profile.' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
    @ApiResponse({ status: 404, description: 'Profile not found.' })
    async update(
        @Param('id') id: string,
        @CurrentUser() userToken: JwtPayload,
        @Body() dto: UpdateProfileDto
    ) {
        const userId = Number(userToken.sub);
        const profileId = Number(id);

        const result= await this.updateProfileUseCase .execute(profileId, userId, dto);

        if (result.isFailure) {
            throw new HttpException(result.error.message, HttpStatus.NOT_FOUND);
        }

        return {
            data: result.getValue(),
            message: 'Perfil actualizado con éxito'
        };
    }
}