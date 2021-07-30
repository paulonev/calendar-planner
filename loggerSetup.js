import { default as Pino } from "pino";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const pinoOptions = {
    prettyPrint: {
        colorize: false,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
    }
}
export const fileLogger = Pino(pinoOptions, Pino.destination(path.join(__dirname, "/logs/app.log")));