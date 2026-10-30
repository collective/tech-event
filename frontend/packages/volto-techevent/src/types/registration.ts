/** State of an Attendee: one registration for an event. */
export type RegistrationState =
  | 'pending'
  | 'registered'
  | 'attended'
  | 'cancelled';

/** State of the Attendees container: whether the event takes registrations. */
export type RegistrationPeriodState = 'created' | 'open' | 'closed';

export type ConfirmationPolicy = 'automatic' | 'email' | 'manual';

/** A ticket of the event, as `@registration` describes it. */
export interface Ticket {
  UID: string;
  title: string;
  description: string;
  admission: boolean;
}

export interface Registration {
  '@id'?: string;
  code: string;
  state: RegistrationState;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  ticket?: Ticket | null;
}

export interface RegistrationData {
  first_name: string;
  last_name: string;
  email: string;
  ticket?: string;
}

/** Settings and state shared by `@registration` and `@attendees`. */
export interface RegistrationPeriod {
  state: RegistrationPeriodState;
  open: boolean;
  closes_at: string | null;
  expired: boolean;
  allow_anonymous_registration: boolean;
  registration_confirmation: ConfirmationPolicy;
  requires_ticket: boolean;
  tickets: Ticket[];
}

/** The answer of `GET @registration` on an event root. */
export interface RegistrationStatus extends RegistrationPeriod {
  '@id': string;
  registration: Registration | null;
  defaults?: RegistrationData;
}

/** Props of the registration form, registered as `TechEventRegistrationForm`. */
export interface RegistrationFormProps {
  defaults?: RegistrationData;
  tickets?: Ticket[];
  submitting?: boolean;
  error?: string | null;
  onSubmit: (data: RegistrationData) => void;
}

/**
 * Props of the registration modal, registered as
 * `TechEventRegistrationModal`: the form, or the user's registration.
 */
export interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  status: RegistrationStatus;
  isLoggedIn: boolean;
  submitting?: boolean;
  error?: string | null;
  onRegister: (data: RegistrationData) => void;
  onCancel: () => void;
}

export interface AttendeeItem extends Registration {
  title: string;
  UID: string;
}

/** The answer of `GET @attendees` on an Attendees container. */
export interface AttendeesListing extends RegistrationPeriod {
  '@id': string;
  items: AttendeeItem[];
  items_total: number;
  counts: Record<RegistrationState, number>;
  can_review: boolean;
}
