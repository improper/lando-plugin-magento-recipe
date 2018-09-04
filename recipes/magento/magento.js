'use strict';

module.exports = lando => {
    // Modules
    const _ = lando.node._;
    const helpers = lando.recipes.get('lamp');
    const base = 'laravel';

    /*
     * Helper to get cache
     */
    const cache = cache => {
        // Return redis
        if (_.includes(cache, 'redis')) {
            return {
                type: cache,
                portforward: true,
                persist: true,
            };
        } else if (_.includes(cache, 'memcached')) {
            return {
                type: cache,
                portforward: true,
            };
        }
    };

    const getDefaultBuild = (name, config) => {
        // Implement Laravels configurable options
        const build = lando.recipes.build(name, base, config);

        // Get the Laravel installer command
        const cmdLaravelInstaller = helpers.getCgr('laravel/installer', '*');

        // Drop laravel/installer command
        _.remove(build.services.appserver.run_internal, function (command) {
            return _.isEqual(command, cmdLaravelInstaller)
        });

        // Drop Laravel Commands
        ['artisan', 'laravel'].forEach(tool => delete build.tooling[tool]);

        return build;
    };

    /*
         * Build out magento
         */
    const build = (name, config) => {
        // We're going to find inspiration from the Laravel recipe
        const webroot = 'pub';

        // Get laravel build for use as the magento template
        const build = getDefaultBuild(name, config);

        // Figure out some tooling needs
        const needs = ['database'];

        // Define webroot if not provided
        if (!_.has(config, 'webroot')) {
            _.set(config, 'webroot', webroot)
        }

        // Install magerun globally
        const cgrInstall = helpers.getCgr('n98/magerun2', '*');

        // Add our cgr cmds
        build.services.appserver.run_internal.push(cgrInstall);

        // Add artisan command
        build.tooling.magento = {
            service: 'magento',
            needs: needs,
            cmd: 'php bin/magento',
        };

        // Add laravel command
        build.tooling.magerun = {
            needs: needs,
            service: 'appserver',
            cmd: '~/.composer/vendor/bin/n98-magerun2',
        };

        // Return the things
        return build;
    };

    // Return the things
    return {
        build,
        configDir: __dirname,
    };
};
