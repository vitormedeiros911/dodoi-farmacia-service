import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { FiltrosFarmaciaDto } from './dto/filtros-farmacia.dto';
import { FarmaciaService } from './farmacia.service';
import { Farmacia } from './schema/farmacia.schema';

const ackErrors: string[] = ['E11000'];

@Controller()
export class FarmaciaController {
  constructor(private readonly farmaciaService: FarmaciaService) {}

  @MessagePattern('criar-farmacia')
  async criarFarmacia(
    @Payload() farmacia: Farmacia,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.farmaciaService.criarFarmacia(farmacia);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-farmacias')
  async buscarFarmacias(
    @Payload() filtrosFarmaciaDto: FiltrosFarmaciaDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.farmaciaService.buscarFarmacias(filtrosFarmaciaDto);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-farmacia-por-id')
  async buscarFarmaciaPorId(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.farmaciaService.buscarFarmaciaPorId(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @MessagePattern('buscar-farmacia-reduzida')
  async buscarFarmaciaReduzida(
    @Payload() id: string,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      return this.farmaciaService.buscarFarmaciaReduzida(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('atualizar-farmacia')
  async atualizarFarmacia(
    @Payload() farmacia: Farmacia,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.farmaciaService.atualizarFarmacia(farmacia);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) await channel.ack(originalMsg);
    }
  }

  @EventPattern('inativar-farmacia')
  async inativarFarmacia(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.farmaciaService.inativarFarmacia(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }

  @EventPattern('ativar-farmacia')
  async ativarFarmacia(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.farmaciaService.ativarFarmacia(id);
    } finally {
      await channel.ack(originalMsg);
    }
  }
}
