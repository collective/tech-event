/**
 * Schedule reducer.
 * @module reducers/schedule/schedule
 */

import { LIST_SCHEDULE } from '@plone-collective/volto-techevent/constants/ActionTypes';
import type {
  DaySchedule,
  ScheduleActionResult,
} from '@plone-collective/volto-techevent/types/schedule';

interface ScheduleState {
  items: DaySchedule[];
  loading: boolean;
  error: string | null;
}

interface ScheduleAction {
  type: string;
  result?: ScheduleActionResult;
  error?: {
    response: {
      error: string;
    };
  };
}

const initialState: ScheduleState = {
  items: [],
  loading: false,
  error: null,
};

export default function sponsors(
  state: ScheduleState = initialState,
  action: ScheduleAction,
): ScheduleState {
  switch (action.type) {
    case `${LIST_SCHEDULE}_PENDING`:
      return {
        ...state,
        loading: true,
        items: [],
        error: null,
      };
    case `${LIST_SCHEDULE}_SUCCESS`:
      return {
        ...state,
        loading: false,
        items: action.result?.items ?? [],
        error: null,
      };
    case `${LIST_SCHEDULE}_FAIL`:
      return {
        ...state,
        loading: false,
        items: [],
        error: action.error?.response?.error ?? 'Unknown error',
      };
    default:
      return state;
  }
}
