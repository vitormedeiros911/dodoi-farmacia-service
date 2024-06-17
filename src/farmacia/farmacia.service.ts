import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { removeMask } from '../shared/functions/remove-mask';
import { Farmacia } from './schema/farmacia.schema';

@Injectable()
export class FarmaciaService {
  constructor(
    @InjectModel('Farmacia') private readonly farmaciaModel: Model<Farmacia>,
    private readonly clientProxyService: ClientProxyService,
  ) {}

  private clientUsuarioBackend =
    this.clientProxyService.getClientProxyUsuarioServiceInstance();

  async criarFarmacia(farmacia: Farmacia) {
    const usuario = await firstValueFrom(
      this.clientUsuarioBackend.send('buscar-usuario', farmacia.emailAdmin),
    );

    if (!usuario)
      throw new RpcException(
        new NotFoundException(
          'Não foi possível encontrar o usuário administrador',
        ),
      );

    if (usuario.idFarmacia)
      throw new RpcException(
        new BadRequestException('Usuário já possui farmácia associada'),
      );

    const farmaciaExistente = await this.farmaciaModel
      .findOne({
        cnpj: farmacia.cnpj,
      })
      .select(['id'])
      .exec();

    if (farmaciaExistente)
      throw new RpcException(new BadRequestException('Farmácia já cadastrada'));

    farmacia.cnpj = removeMask(farmacia.cnpj);
    farmacia.endereco.cep = removeMask(farmacia.endereco.cep);

    const novaFarmacia = new this.farmaciaModel({
      id: uuid(),
      ...farmacia,
      idUsuarioAdmin: usuario.id,
    });

    await novaFarmacia.save();

    this.clientUsuarioBackend.emit('associar-usuario-admin-farmacia', {
      idUsuario: usuario.id,
      idFarmacia: novaFarmacia.id,
    });

    return {
      mensagem: 'Farmácia criada com sucesso',
    };
  }

  async buscarFarmaciaPorId(id: string): Promise<Farmacia> {
    return this.farmaciaModel.findOne({ id });
  }

  async buscarFarmaciaReduzida(id: string): Promise<Farmacia> {
    const query = this.farmaciaModel
      .findOne()
      .select(['id', 'nome', 'urlImagem'])
      .where('id')
      .equals(id);

    return query.exec();
  }

  async atualizarFarmacia(farmacia: Farmacia) {
    const farmaciaExistente = await this.farmaciaModel
      .findOne({
        cnpj: farmacia.cnpj,
      })
      .select(['id'])
      .where('id')
      .ne(farmacia.id)
      .exec();

    if (farmaciaExistente)
      throw new RpcException(new BadRequestException('Farmácia já cadastrada'));

    farmacia.cnpj = removeMask(farmacia.cnpj);
    farmacia.endereco.cep = removeMask(farmacia.endereco?.cep);

    await this.farmaciaModel.updateOne({ id: farmacia.id }, farmacia);

    return {
      mensagem: 'Farmácia atualizada com sucesso',
    };
  }
}
