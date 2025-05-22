import { useSelector, shallowEqual } from 'react-redux';
import type { EventSettings } from '@plone-collective/volto-techevent/types/eventSettings';

interface UseEventSettingsResult {
  eventRoot: string;
  data: EventSettings;
}

export function useEventSettings(): UseEventSettingsResult {
  const eventSettingBehavior = useSelector(
    (state) =>
      state.content?.data?.['@components']?.inherit?.[
        'collective.techevent.event_settings'
      ],
    shallowEqual,
  );
  const eventRoot = eventSettingBehavior?.from?.['@id'] || '';
  const data = eventSettingBehavior?.data || {
    audience: [],
    durations_keynote: [],
    durations_talk: [],
    durations_training: [],
    end: '',
    start: '',
    levels: [],
    tracks: [],
  };

  return { eventRoot, data };
}
