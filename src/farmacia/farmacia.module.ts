import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FarmaciaService } from './farmacia.service';
import { FarmaciaSchema } from './schema/farmacia.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Farmacia', schema: FarmaciaSchema }]),
  ],
  providers: [FarmaciaService],
})
export class FarmaciaModule {}
