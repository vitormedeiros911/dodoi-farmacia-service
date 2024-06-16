import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ClientProxyModule } from '../client-proxy/client-proxy.module';
import { FarmaciaController } from './farmacia.controller';
import { FarmaciaService } from './farmacia.service';
import { FarmaciaSchema } from './schema/farmacia.schema';

@Module({
  imports: [
    ClientProxyModule,
    MongooseModule.forFeature([{ name: 'Farmacia', schema: FarmaciaSchema }]),
  ],
  providers: [FarmaciaService],
  controllers: [FarmaciaController],
})
export class FarmaciaModule {}
