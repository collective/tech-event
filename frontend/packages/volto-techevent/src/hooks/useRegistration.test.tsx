// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useRegistration } from './useRegistration';
import {
  CANCEL_REGISTRATION,
  GET_REGISTRATION,
  POST_REGISTRATION,
} from '../constants/ActionTypes';
import { initialState } from '../reducers/registration/registration';
import { openStatus } from '../components/Registration/fixtures';

function setup(eventRoot: string) {
  const actions: any[] = [];
  const store = {
    getState: () => ({
      registration: { ...initialState, status: openStatus },
    }),
    subscribe: () => () => {},
    dispatch: (action: any) => {
      actions.push(action);
      return action;
    },
  };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store as any}>{children}</Provider>
  );
  const hook = renderHook(() => useRegistration(eventRoot), { wrapper });
  return { actions, ...hook };
}

describe('useRegistration', () => {
  it('requests the registration status of the event root', () => {
    const { actions, result } = setup('/event');
    expect(actions).toEqual([
      expect.objectContaining({
        type: GET_REGISTRATION,
        request: { op: 'get', path: '/event/@registration' },
      }),
    ]);
    expect(result.current.status).toEqual(openStatus);
  });

  it('requests nothing without an event root', () => {
    const { actions } = setup('');
    expect(actions).toEqual([]);
  });

  it('registers and cancels on the event root', () => {
    const { actions, result } = setup('/event');
    act(() => result.current.register({ email: 'ada@example.org' }));
    act(() => result.current.cancel());
    expect(actions.map((action) => action.type)).toEqual([
      GET_REGISTRATION,
      POST_REGISTRATION,
      CANCEL_REGISTRATION,
    ]);
    expect(actions[1].request.data).toEqual({ email: 'ada@example.org' });
  });
});
