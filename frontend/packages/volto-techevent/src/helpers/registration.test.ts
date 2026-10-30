import { describe, it, expect } from 'vitest';
import {
  MANAGE_ROUTE,
  VERIFY_ROUTE,
  contextFromPath,
  routeOf,
} from './registration';

describe('contextFromPath', () => {
  it.each([
    ['/registration/verify', VERIFY_ROUTE, '/'],
    ['/event/registration/verify', VERIFY_ROUTE, '/event'],
    ['/en/events/conf/registration/verify', VERIFY_ROUTE, '/en/events/conf'],
    ['/manage-registrations', MANAGE_ROUTE, '/'],
    ['/registrations/manage-registrations', MANAGE_ROUTE, '/registrations'],
    ['/event/attendees/manage-registrations', MANAGE_ROUTE, '/event/attendees'],
  ])('finds the context of %s', (path, route, root) => {
    expect(contextFromPath(path, route)).toBe(root);
  });
});

describe('routeOf', () => {
  it.each([
    ['http://localhost:3000', '/manage-registrations'],
    ['http://localhost:3000/', '/manage-registrations'],
    ['/', '/manage-registrations'],
    [
      'http://localhost:3000/registrations',
      '/registrations/manage-registrations',
    ],
    ['/event/attendees/', '/event/attendees/manage-registrations'],
  ])('puts the route below %s', (context, path) => {
    expect(routeOf(context, MANAGE_ROUTE)).toBe(path);
  });
});
