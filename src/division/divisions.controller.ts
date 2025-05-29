import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Division } from './schemas/division.schema';

@ApiTags('divisions')
@Controller('divisions')
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  @Get()
  @ApiOperation({ summary: '사업소 목록 조회' })
  @ApiOkResponse({
    description: '사업소 목록 조회 성공',
    type: [Division],
  })
  @ApiBadRequestResponse({
    description: '사업소 목록 조회 실패',
  })
  async findAll() {
    return this.divisionsService.findAll();
  }

  @Get(':division')
  @ApiOperation({ summary: '사업소 조회' })
  @ApiOkResponse({
    description: '사업소 조회 성공',
    type: Division,
  })
  @ApiBadRequestResponse({
    description: '사업소 조회 실패',
  })
  async findOne(@Param('division') division: string) {
    return this.divisionsService.findOne(division);
  }

  @Post(':division')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사업소 생성' })
  @ApiBody({ type: CreateDivisionDto })
  @ApiOkResponse({
    description: '사업소 생성 성공',
    type: Division,
  })
  @ApiBadRequestResponse({
    description: '사업소 생성 실패',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async create(@Body() createDivisionDto: CreateDivisionDto) {
    return this.divisionsService.create(createDivisionDto);
  }

  @Put(':divisionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사업소 수정' })
  @ApiBody({ type: CreateDivisionDto })
  @ApiOkResponse({
    description: '사업소 수정 성공',
    type: Division,
  })
  @ApiBadRequestResponse({
    description: '사업소 수정 실패',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async update(
    @Param('divisionId') divisionId: string,
    @Body() updateDivisionDto: Partial<CreateDivisionDto>,
  ) {
    return this.divisionsService.update(divisionId, updateDivisionDto);
  }

  //수정 필요
  @Delete(':divisionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사업소 삭제' })
  @ApiOkResponse({
    description: '사업소 삭제 성공',
    type: Boolean,
  })
  @ApiBadRequestResponse({
    description: '사업소 삭제 실패',
  })
  @ApiUnauthorizedResponse({
    description: '인증되지 않은 사용자',
  })
  async remove(@Param('divisionId') divisionId: string): Promise<boolean> {
    await this.divisionsService.remove(divisionId);
    return true;
  }
}
