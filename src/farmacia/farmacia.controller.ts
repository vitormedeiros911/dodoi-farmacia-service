import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { FarmaciaService } from './farmacia.service';
import { Farmacia } from './schema/farmacia.schema';

@Controller()
export class FarmaciaController {
  constructor(private readonly farmaciaService: FarmaciaService) {}

  @EventPattern('criar-farmacia')
  async criarFarmacia(@Payload() farmacia: Farmacia) {
    await this.farmaciaService.criarFarmacia(farmacia);
  }

  @MessagePattern('buscar-farmacia-por-id')
  async buscarFarmaciaPorId(id: string): Promise<Farmacia> {
    return this.farmaciaService.buscarFarmaciaPorId(id);
  }

  @MessagePattern('buscar-farmacia-para-produto')
  async buscarFarmaciaParaProduto(id: string): Promise<Farmacia> {
    return this.farmaciaService.buscarFarmaciaParaProduto(id);
  }
}
