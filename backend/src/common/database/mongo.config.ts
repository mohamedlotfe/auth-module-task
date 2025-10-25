import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getMongoConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  return {
    type: 'mongodb',
    url: configService.get<string>('MONGODB_URI'),
    synchronize: true, //configService.get<string>('NODE_ENV') !== 'production',
    logging: true, //configService.get<string>('NODE_ENV') === 'development',
    entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
  };
};
