
import pkg from '../package.json';
import Chronos from './chronos';

let chronos = new Chronos(process.env.CHRONOS_URI);

export function register(server, options, next) {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            handler: (request, reply) => {

                reply('<a href="/metrics">/metrics</a>');
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/metrics',
        config: {
            handler: (request, reply) => {

                chronos
                    .getMetrics()
                    .then(metrics => reply(metrics).type('text/plain'))
                    .catch( err => reply(err));
            }
        }
    });

    next();
}

register.attributes = {pkg};
