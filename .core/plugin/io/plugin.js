const chalk = require('chalk');
const op = require('object-path');
const _ = require('underscore');
const { CloudRunOptions } = require(`${ACTINIUM_DIR}/lib/utils`);
const { Registry } = require(`${ACTINIUM_DIR}/lib/utils`);

const PLUGIN = {
    ID: 'IO',
    description: 'Socket.io plugin',
    name: 'Socket.io Plugin',
    order: 100,
    version: {
        actinium: '>=3.2.6',
        plugin: '0.0.1',
    },
    bundle: [],
    meta: {
        builtIn: true,
    },
};

/**
 * ----------------------------------------------------------------------------
 * Extend Actinium SDK
 * ----------------------------------------------------------------------------
 */

/**
 * ----------------------------------------------------------------------------
 * Plugin registration
 * ----------------------------------------------------------------------------
 */
Actinium.Plugin.register(PLUGIN, true);

/**
 * ----------------------------------------------------------------------------
 * Hook registration
 * ----------------------------------------------------------------------------
 */
Actinium.IO = {
    clients: new Registry(
        'ioClients',
        'id',
        Actinium.Utils.Registry.MODES.CLEAN,
    ),
};

Actinium.Hook.register('start', async () => {
    if (!Actinium.Plugin.isActive(PLUGIN.ID)) return;

    BOOT();
    BOOT('Attaching socket.io.');

    const socketConfig = {
        path: '/actinium.io',
        serverClient: false,
        cors: {
            origin: '*',
        },
    };

    await Actinium.Hook.run('io.config', socketConfig);

    const io = (Actinium.IO.server = require('socket.io')(
        Actinium.server,
        socketConfig,
    ));

    await Actinium.Hook.run('io.init', Actinium.IO);
});

Actinium.Hook.register(
    'io.init',
    IO => {
        IO.server.on('connection', client => {
            Actinium.Hook.run('io.connection', client);
        });
    },
    Actinium.Enums.priority.highest,
);

Actinium.Hook.register(
    'io.connection',
    client => {
        DEBUG(`${client.id} connecting`);

        const entry = {
            id: client.id,
            client,
        };

        Actinium.IO.clients.register(client.id, entry);

        client.on('disconnecting', () => {
            DEBUG(`${client.id} disconnecting`);
            () => Actinium.Hook.run('io.disconnecting', client);
            Actinium.IO.clients.unregister(client.id);
        });
    },
    Actinium.Enums.priority.highest,
);
