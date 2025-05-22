import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { listSponsors } from '@plone-collective/volto-techevent/actions/sponsors/sponsors';
import type {
  SponsorBenefit,
  SponsorLevel,
} from '@plone-collective/volto-techevent/types';

interface UseSponsorsResult {
  benefits: SponsorBenefit[];
  levels: SponsorLevel[];
  loading: boolean;
  error: string | null;
}

export function useSponsors(eventRoot: string): UseSponsorsResult {
  const dispatch = useDispatch();

  const { benefits, levels, loading, error } = useSelector(
    (state) => state.sponsors,
    shallowEqual,
  );

  useEffect(() => {
    if (eventRoot) {
      dispatch(listSponsors(eventRoot));
    }
  }, [dispatch, eventRoot]);

  return { benefits, levels, loading, error };
}
