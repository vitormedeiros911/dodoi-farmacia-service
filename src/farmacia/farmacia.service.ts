import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Farmacia } from './schema/farmacia.schema';

@Injectable()
export class FarmaciaService {
  constructor(
    @InjectModel('Farmacia') private readonly farmaciaModel: Model<Farmacia>,
  ) {}
}
