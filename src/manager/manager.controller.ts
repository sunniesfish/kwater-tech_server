import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ManagerService } from './manager.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Manager } from './schemas/manager.schema';
import { ManagerResponseDto } from './dto/manager-response.dto';

@ApiTags('manager')
@ApiBearerAuth('access-token')
@Controller('manager')
@UseGuards(JwtAuthGuard)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  @ApiOperation({ summary: '새로운 관리자 생성' })
  @ApiBody({ type: CreateManagerDto })
  @ApiResponse({
    status: 201,
    description: '관리자 생성 성공',
    schema: {
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: '관리자가 성공적으로 생성되었습니다',
        },
        data: {
          type: 'object',
          properties: {
            managerId: { type: 'string', example: 'manager001' },
            managerName: { type: 'string', example: '홍길동' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청 데이터',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async create(@Body() createManagerDto: CreateManagerDto) {
    const newManager = await this.managerService.create(createManagerDto);
    return {
      success: true,
      message: '관리자가 성공적으로 생성되었습니다',
      data: {
        managerId: newManager.managerId,
        managerName: newManager.managerName,
      },
    };
  }

  @Get()
  @ApiOperation({ summary: '모든 관리자 조회' })
  @ApiOkResponse({
    description: '관리자 목록 조회 성공',
    type: [ManagerResponseDto],
  })
  @ApiBadRequestResponse({
    description: '관리자 목록 조회 실패',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async findAll(): Promise<ManagerResponseDto[]> {
    const managers = await this.managerService.findAll();
    return managers.map((manager) => ({
      managerId: manager.managerId,
      managerName: manager.managerName,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 관리자 조회' })
  @ApiParam({ name: 'id', description: '관리자 ID', example: 'manager001' })
  @ApiOkResponse({
    description: '관리자 조회 성공',
    type: ManagerResponseDto,
  })
  @ApiBadRequestResponse({
    description: '관리자 조회 실패',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async findOne(@Param('id') id: string): Promise<ManagerResponseDto> {
    const manager = await this.managerService.findOne(id);
    return {
      managerId: manager.managerId,
      managerName: manager.managerName,
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '관리자 정보 수정' })
  @ApiParam({ name: 'id', description: '관리자 ID', example: 'manager001' })
  @ApiBody({ type: CreateManagerDto })
  @ApiOkResponse({
    description: '관리자 정보 수정 성공',
    type: ManagerResponseDto,
  })
  @ApiBadRequestResponse({
    description: '잘못된 요청 데이터',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async update(
    @Param('id') id: string,
    @Body() updateManagerDto: Partial<CreateManagerDto>,
  ): Promise<ManagerResponseDto> {
    const updatedManager = await this.managerService.update(
      id,
      updateManagerDto,
    );
    return {
      managerId: updatedManager.managerId,
      managerName: updatedManager.managerName,
    };
  }

  // 수정 필요
  @Delete(':id')
  @ApiOperation({ summary: '관리자 삭제' })
  @ApiParam({ name: 'id', description: '관리자 ID', example: 'manager001' })
  @ApiOkResponse({
    description: '관리자 삭제 성공',
    type: Boolean,
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  @ApiBadRequestResponse({
    description: '관리자 삭제 실패',
  })
  async remove(@Param('id') id: string): Promise<boolean> {
    await this.managerService.remove(id);
    return true;
  }
}
