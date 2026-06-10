import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard-stats')
  @Roles('admin')
  @ApiOperation({
    summary: 'Get dashboard statistics',
    description:
      'Retrieves aggregated statistics for the admin dashboard, including total revenue, active bookings, and room availability. Requires Admin privileges.',
  })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}
