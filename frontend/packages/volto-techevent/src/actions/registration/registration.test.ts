import { describe, it, expect } from 'vitest';
import {
  cancelRegistration,
  getRegistration,
  listAttendees,
  postRegistration,
  verifyRegistration,
} from './registration';
import {
  CANCEL_REGISTRATION,
  GET_REGISTRATION,
  LIST_ATTENDEES,
  POST_REGISTRATION,
  VERIFY_REGISTRATION,
} from '../../constants/ActionTypes';

describe('registration actions', () => {
  it('gets @registration below the event root', () => {
    expect(getRegistration('/event')).toEqual({
      type: GET_REGISTRATION,
      request: { op: 'get', path: '/event/@registration' },
    });
  });

  it('posts the registration data', () => {
    const data = { first_name: 'Ada', last_name: 'L', email: 'a@example.org' };
    expect(postRegistration('/event', data)).toEqual({
      type: POST_REGISTRATION,
      request: { op: 'post', path: '/event/@registration', data },
    });
  });

  it('cancels with a post to @registration/cancel', () => {
    expect(cancelRegistration('/en/conf')).toEqual({
      type: CANCEL_REGISTRATION,
      request: { op: 'post', path: '/en/conf/@registration/cancel', data: {} },
    });
  });

  it('verifies with the token', () => {
    expect(verifyRegistration('/event', 'abc.def')).toEqual({
      type: VERIFY_REGISTRATION,
      request: {
        op: 'post',
        path: '/event/@registration/verify',
        data: { token: 'abc.def' },
      },
    });
  });

  it('lists the attendees of a container', () => {
    expect(listAttendees('/event/attendees')).toEqual({
      type: LIST_ATTENDEES,
      request: { op: 'get', path: '/event/attendees/@attendees' },
    });
  });

  it('filters the attendees by state', () => {
    expect(listAttendees('/event/attendees', 'pending').request.path).toBe(
      '/event/attendees/@attendees?review_state=pending',
    );
  });
});
