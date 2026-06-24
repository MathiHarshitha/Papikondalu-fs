import { Controller, Post, Get, Body, Param, UseGuards, Headers, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('create-order/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Razorpay order for booking' })
  createOrder(@Param('bookingId') bookingId: string, @CurrentUser() user: any) {
    return this.paymentsService.createOrder(bookingId, user.id);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOperation({ summary: 'Verify payment signature' })
  verifyPayment(@Body() body: any) {
    return this.paymentsService.verifyPayment(body);
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Razorpay webhook handler' })
  webhook(@Body() payload: any, @Headers('x-razorpay-signature') signature: string) {
    return this.paymentsService.handleWebhook(payload, signature);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my payment history' })
  getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.getUserPayments(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment details' })
  getPayment(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }
}
