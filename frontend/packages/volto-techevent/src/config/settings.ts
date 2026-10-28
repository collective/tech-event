import type { ConfigType } from '@plone/registry';
import { contentIcons } from '@plone-collective/volto-techevent/helpers/icons';

type apiExpanderInherit = {
  match: string;
  GET_CONTENT: string[];
  querystring:
    | { [key: string]: string }
    | ((
        config,
        querystring: { config: ConfigType; querystring: object },
      ) => { [key: string]: string });
};

export default function install(config: ConfigType) {
  config.settings.apiExpanders = [
    ...config.settings.apiExpanders,
    {
      match: '',
      GET_CONTENT: ['inherit'],
      querystring: (config, querystring) => {
        if (querystring['expand.inherit.behaviors']) {
          return {
            'expand.inherit.behaviors': querystring[
              'expand.inherit.behaviors'
            ].concat(',', 'collective.techevent.event_settings'),
          };
        } else {
          return {
            'expand.inherit.behaviors': 'collective.techevent.event_settings',
          };
        }
      },
    } as apiExpanderInherit,
  ];
  config.settings.contentIcons = {
    ...config.settings.contentIcons,
    ...contentIcons,
  };
  return config;
}
