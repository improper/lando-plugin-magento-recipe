# Magento Recipe for Lando

**Note - This is currently in it's proof-of-concept phase. The  NGINX and PHP.ini config currently implement Lando's Laravel config. For now, you will need to override these in your `.lando.yml`** 

## Install

1. `yarn add lando-plugin-magento-recipe`
2. Update project `.lando.yml`:

```yaml
plugins:
  - lando-plugin-magento-recipe
```
