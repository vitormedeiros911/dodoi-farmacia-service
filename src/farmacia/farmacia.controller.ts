import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { FarmaciaService } from './farmacia.service';
import { Farmacia } from './schema/farmacia.schema';

@Controller()
export class FarmaciaController {
  constructor(private readonly farmaciaService: FarmaciaService) {}

  @EventPattern('criar-farmacia')
  async criarFarmacia(@Payload() farmacia: Farmacia) {
    await this.farmaciaService.criarFarmacia(farmacia);
  }
}
