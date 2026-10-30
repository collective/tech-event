import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  cancelRegistration,
  getRegistration,
  postRegistration,
} from '@plone-collective/volto-techevent/actions/registration/registration';
import type { RegistrationReducerState } from '@plone-collective/volto-techevent/reducers/registration/registration';
import type { RegistrationData } from '@plone-collective/volto-techevent/types/registration';

interface UseRegistrationResult
  extends Omit<RegistrationReducerState, 'verify'> {
  register: (data: Partial<RegistrationData>) => void;
  cancel: () => void;
}

/**
 * The registration status of an event and the current user's registration,
 * with the actions to register and to cancel.
 * @param eventRoot - Path to the event root object.
 * @param isLoggedIn - Reload the status when the user logs in or out.
 */
export function useRegistration(
  eventRoot: string,
  isLoggedIn = false,
): UseRegistrationResult {
  const dispatch = useDispatch();
  const { status, loading, error, submitting, submitError } = useSelector(
    (state: { registration: RegistrationReducerState }) => state.registration,
    shallowEqual,
  );

  useEffect(() => {
    if (eventRoot) {
      dispatch(getRegistration(eventRoot));
    }
  }, [dispatch, eventRoot, isLoggedIn]);

  const register = useCallback(
    (data: Partial<RegistrationData>) => {
      dispatch(postRegistration(eventRoot, data));
    },
    [dispatch, eventRoot],
  );

  const cancel = useCallback(() => {
    dispatch(cancelRegistration(eventRoot));
  }, [dispatch, eventRoot]);

  return { status, loading, error, submitting, submitError, register, cancel };
}
