import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FarmaciaService } from './farmacia.service';
import { FarmaciaSchema } from './schema/farmacia.schema';
import { FarmaciaController } from './farmacia.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Farmacia', schema: FarmaciaSchema }]),
  ],
  providers: [FarmaciaService],
  controllers: [FarmaciaController],
})
export class FarmaciaModule {}
