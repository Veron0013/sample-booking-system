import { Params } from 'nestjs-pino';

export const loggerConfig: Params = {
  pinoHttp: {
    level: 'info',
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            singleLine: true,
          },
        },
      ],
    },

    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          //params: req.params,
          //query: req.raw?.query,
          //body: req.raw?.body,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  },
};
