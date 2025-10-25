import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttlerConfig = (
  configSrv: ConfigService,
): ThrottlerModuleOptions => {
  return {
    throttlers: [
      {
        ttl: parseInt(configSrv.get<string>('THROTTLE_TTL') || '60', 10),
        limit: parseInt(configSrv.get<string>('THROTTLE_LIMIT') || '10', 10),
      },
    ],
  };
};
