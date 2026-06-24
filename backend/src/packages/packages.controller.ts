import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { CreatePackageDto, UpdatePackageDto, PackageQueryDto } from './dto/package.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('packages')
@Controller('packages')
export class PackagesController {
  constructor(private packagesService: PackagesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all packages with filters' })
  findAll(@Query() query: PackageQueryDto) {
    return this.packagesService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured packages' })
  getFeatured() {
    return this.packagesService.findFeatured();
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get package by ID or slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    return this.packagesService.findOne(idOrSlug);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Check seat availability' })
  checkAvailability(@Param('id') id: string, @Query('persons') persons: number) {
    return this.packagesService.checkAvailability(id, Number(persons));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create package (admin)' })
  create(@Body() dto: CreatePackageDto) {
    return this.packagesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update package (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
    return this.packagesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete package (admin)' })
  remove(@Param('id') id: string) {
    return this.packagesService.remove(id);
  }
}
