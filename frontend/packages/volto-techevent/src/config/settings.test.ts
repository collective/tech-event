import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
import { contentIcons } from '../helpers/icons';
import installSettings from './settings';

type Querystring = Record<string, string>;
type Expander = {
  match: string;
  GET_CONTENT: string[];
  querystring: (config: unknown, querystring: Querystring) => Querystring;
};

function makeConfig(apiExpanders: unknown[] = []) {
  return { settings: { apiExpanders } } as unknown as ConfigType;
}

function eventExpander(config: ConfigType): Expander {
  const expanders = config.settings.apiExpanders as unknown as Expander[];
  return expanders[expanders.length - 1];
}

describe('installSettings', () => {
  it('adds an inherit expander for the event settings behavior', () => {
    const config = installSettings(makeConfig());
    const expander = eventExpander(config);
    expect(expander.match).toBe('');
    expect(expander.GET_CONTENT).toEqual(['inherit']);
  });

  it('requests the event settings behavior when none was asked for', () => {
    const config = installSettings(makeConfig());
    expect(eventExpander(config).querystring({}, {})).toEqual({
      'expand.inherit.behaviors': 'collective.techevent.event_settings',
    });
  });

  it('appends the event settings behavior to the behaviors asked for', () => {
    const config = installSettings(makeConfig());
    expect(
      eventExpander(config).querystring(
        {},
        { 'expand.inherit.behaviors': 'some.behavior' },
      ),
    ).toEqual({
      'expand.inherit.behaviors':
        'some.behavior,collective.techevent.event_settings',
    });
  });

  it('registers the icons of the add-on content types', () => {
    const config = installSettings(makeConfig());
    expect(config.settings.contentIcons.Talk).toBe(contentIcons.Talk);
    expect(config.settings.contentIcons['Tech Event']).toBe(
      contentIcons['Tech Event'],
    );
  });

  it('keeps the content icons already registered', () => {
    const config = {
      settings: { apiExpanders: [], contentIcons: { Document: 'page' } },
    } as unknown as ConfigType;
    installSettings(config);
    expect(config.settings.contentIcons.Document).toBe('page');
    expect(config.settings.contentIcons.Presenter).toBe(contentIcons.Presenter);
  });

  it('keeps the expanders already registered', () => {
    const existing = { match: 'other', GET_CONTENT: ['x'] };
    const config = installSettings(makeConfig([existing]));
    expect(config.settings.apiExpanders).toHaveLength(2);
    expect(config.settings.apiExpanders[0]).toBe(existing);
  });
});
