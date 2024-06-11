import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { Farmacia } from './schema/farmacia.schema';

@Injectable()
export class FarmaciaService {
  constructor(
    @InjectModel('Farmacia') private readonly farmaciaModel: Model<Farmacia>,
  ) {}

  async criarFarmacia(farmacia: Farmacia): Promise<void> {
    const novaFarmacia = new this.farmaciaModel({
      id: uuid(),
      ...farmacia,
    });

    novaFarmacia.save();
  }
}
