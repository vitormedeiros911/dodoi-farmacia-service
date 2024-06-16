import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { IEndereco } from '../interface/endereco.interface';

@Schema({ timestamps: true, collection: 'farmacias' })
export class Farmacia {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  razaoSocial: string;

  @Prop({ required: true })
  cnpj: string;

  @Prop({ required: true })
  urlImagem: string;

  @Prop({
    type: {
      logradouro: { type: String, required: true },
      numero: { type: String, required: true },
      complemento: { type: String, required: false },
      bairro: { type: String, required: true },
      cidade: { type: String, required: true },
      uf: { type: String, required: true },
      cep: { type: String, required: true },
    },
    required: true,
  })
  endereco: IEndereco;

  @Prop({ required: true })
  idUsuarioAdmin: string;

  @Prop({ required: true })
  emailAdmin: string;
}

export const FarmaciaSchema = SchemaFactory.createForClass(Farmacia);
