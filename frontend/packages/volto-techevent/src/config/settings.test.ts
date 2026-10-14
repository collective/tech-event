import { describe, it, expect } from 'vitest';
import type { ConfigType } from '@plone/registry';
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

  it('keeps the expanders already registered', () => {
    const existing = { match: 'other', GET_CONTENT: ['x'] };
    const config = installSettings(makeConfig([existing]));
    expect(config.settings.apiExpanders).toHaveLength(2);
    expect(config.settings.apiExpanders[0]).toBe(existing);
  });
});
