import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Fxql {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  SourceCurrency: string;

  @Column()
  DestinationCurrency: string;

  @Column()
  BuyPrice: string;

  @Column()
  SellPrice: string;

  @Column()
  CapAmount: string;
}
