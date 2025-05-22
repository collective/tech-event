/**
 * Sponsors reducer.
 * @module reducers/sponsors/sponsors
 */

import { LIST_SPONSORS } from '@plone-collective/volto-techevent/constants/ActionTypes';
import type {
  SponsorBenefit,
  SponsorsLevel,
  SponsorsLevels,
} from '@plone-collective/volto-techevent/types/sponsors';

interface SponsorsState {
  benefits: SponsorBenefit[];
  levels: SponsorsLevel[];
  loading: boolean;
  error: string | null;
}

interface SponsorsAction {
  type: string;
  result?: SponsorsLevels;
  error?: {
    response: {
      error: string;
    };
  };
}

const initialState: SponsorsState = {
  benefits: [],
  levels: [],
  loading: false,
  error: null,
};

export default function sponsors(
  state: SponsorsState = initialState,
  action: SponsorsAction,
): SponsorsState {
  switch (action.type) {
    case `${LIST_SPONSORS}_PENDING`:
      return {
        ...state,
        loading: true,
        benefits: [],
        levels: [],
        error: null,
      };
    case `${LIST_SPONSORS}_SUCCESS`:
      return {
        ...state,
        loading: false,
        benefits: action.result?.benefits ?? [],
        levels: action.result?.items ?? [],
        error: null,
      };
    case `${LIST_SPONSORS}_FAIL`:
      return {
        ...state,
        loading: false,
        benefits: [],
        levels: [],
        error: action.error?.response?.error ?? 'Unknown error',
      };
    default:
      return state;
  }
}
