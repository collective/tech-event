import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { listSchedule } from '@plone-collective/volto-techevent/actions/schedule/schedule';
import type { DaySchedule } from '@plone-collective/volto-techevent/types/schedule';

interface UseScheduleResult {
  items: DaySchedule[];
  loading: boolean;
  error: string | null;
}

export function useSchedule(eventRoot: string): UseScheduleResult {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector(
    (state) => state.schedule,
    shallowEqual,
  );

  useEffect(() => {
    if (eventRoot) {
      dispatch(listSchedule(eventRoot));
    }
  }, [dispatch, eventRoot]);

  return { items, loading, error };
}
