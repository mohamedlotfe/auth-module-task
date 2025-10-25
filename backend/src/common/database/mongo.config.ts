import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const mongoConfig = (configSrv: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'mongodb',
    url: configSrv.get<string>('MONGODB_URI'),
    synchronize: true,
    logging: true,
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
  };
};
