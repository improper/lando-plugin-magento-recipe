'use strict';

module.exports = lando => {
    const recipe = 'magento';
    const recipeEventObservers = 1;

    lando.events.setMaxListeners(lando.events.getMaxListeners() + recipeEventObservers);

    // Add particular recipes to lando
    lando.events.on('post-bootstrap', 8, lando => {
        const recipeModule = './recipes/' + [recipe, recipe].join('/');
        lando.recipes.add(recipe, require(recipeModule)(lando));

        if(lando.recipes.get(recipe)) {
            lando.log.verbose('Recipe %s loaded', recipe);
        }
    });
};
