import { BadRequestException, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { ClientProxyService } from '../client-proxy/client-proxy.service';
import { removeMask } from '../shared/functions/remove-mask';
import { FiltrosFarmaciaDto } from './dto/filtros-farmacia.dto';
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
    });

    await novaFarmacia.save();

    this.clientUsuarioBackend.emit('associar-usuario-admin-farmacia', {
      idUsuario: farmacia.idUsuarioAdmin,
      idFarmacia: novaFarmacia.id,
    });

    return this.buscarFarmaciaPorId(novaFarmacia.id);
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

    if (farmacia.endereco?.cep)
      farmacia.endereco.cep = removeMask(farmacia.endereco?.cep);

    await this.farmaciaModel.updateOne({ id: farmacia.id }, farmacia);

    return {
      mensagem: 'Farmácia atualizada com sucesso',
    };
  }

  async buscarFarmacias(filtrosFarmaciaDto: FiltrosFarmaciaDto) {
    const { nome, status, limit, skip } = filtrosFarmaciaDto;

    const query = this.farmaciaModel.find().select(['id', 'nome', 'urlImagem']);

    if (nome) query.where('nome').regex(new RegExp(nome, 'i'));

    if (status) query.where('status').equals(status);

    const countQuery = this.farmaciaModel
      .find(query.getFilter())
      .countDocuments();

    if (skip) query.skip(skip);

    if (limit) query.limit(limit);

    const farmacias = await query.exec();
    const total = await countQuery.exec();

    return {
      total,
      farmacias,
    };
  }
}
