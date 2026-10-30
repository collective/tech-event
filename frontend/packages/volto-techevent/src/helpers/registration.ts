/**
 * Paths of the registration routes, which live below their context: the
 * event root, or the Attendees container.
 * @module helpers/registration
 */
import { flattenToAppURL } from '@plone/volto/helpers/Url/Url';

/** The target of the emailed confirmation link. */
export const VERIFY_ROUTE = '/registration/verify';

/** The registration desk of the organizers, below an Attendees container. */
export const MANAGE_ROUTE = '/manage-registrations';

/**
 * The path of the context of a route, from the path of the route.
 * @param pathname - Such as `/event/registration/verify`.
 * @param route - The route, such as {@link VERIFY_ROUTE}.
 */
export function contextFromPath(pathname: string, route: string): string {
  const index = pathname.lastIndexOf(route);
  return index > 0 ? pathname.slice(0, index) : '/';
}

/**
 * The path of a route below its context.
 * @param context - The URL or path of the context.
 * @param route - The route, such as {@link MANAGE_ROUTE}.
 */
export function routeOf(context: string, route: string): string {
  const root = flattenToAppURL(context).replace(/\/+$/, '');
  return `${root}${route}`;
}
