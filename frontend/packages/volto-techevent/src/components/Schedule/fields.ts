/**
 * Loose shapes for the fields the schedule components read.
 *
 * The shared types in `types/schedule.ts` do not match what the backend
 * sends: vocabulary terms carry a `token`, while the vocabulary interfaces
 * declare an `id`. Each component therefore declares only the keys it reads.
 */
import type { ComponentProps } from 'react';
import type UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

/** A start and end time, as ISO 8601 strings. */
export interface TimeSpan {
  start: string | null;
  end: string | null;
}

/** A vocabulary term as rendered by the schedule. */
export interface TermLike {
  token?: string;
  title?: string;
}

/** The room a slot takes place in. */
export interface RoomField {
  room?: Array<{ token?: string; title: string }> | null;
}

/** The item prop of Volto's UniversalLink. */
export type LinkItem = ComponentProps<typeof UniversalLink>['item'];

/** The language of a session, as a term or a bare token. */
export interface LanguageField {
  session_language?: TermLike | string | Array<TermLike | string> | null;
}
