"""Self-registration for an event.

Visitors never get permissions on the Attendees container: these functions
create and change Attendees on their behalf, after checking what they may
do. The REST services in :mod:`collective.techevent.users.services` are thin
wrappers around them.
"""

from collective.techevent import _
from collective.techevent.users.content.attendee import Attendee
from collective.techevent.users.content.attendee import IAttendee
from collective.techevent.users.content.attendees import Attendees
from collective.techevent.users.content.attendees import CONFIRMATION_AUTOMATIC
from collective.techevent.users.content.attendees import CONFIRMATION_EMAIL
from collective.techevent.users.content.attendees import OPEN_STATE
from collective.techevent.users.emails import send_verification
from collective.techevent.users.tokens import InvalidToken
from collective.techevent.users.tokens import read_token
from collective.techevent.users.utils import duplicate_message
from collective.techevent.users.utils import find_attendees
from collective.techevent.users.utils import is_organizer
from collective.techevent.users.utils import normalize_email
from plone import api
from plone.restapi.serializer.converters import json_compatible
from typing import Any
from zope.i18nmessageid import Message
from zope.schema import ValidationError


CANCELLABLE_STATES = ("pending", "registered")

EMAIL_FIELD = IAttendee.get("email")


class RegistrationError(Exception):
    """A registration request that cannot be carried out.

    :param status: The HTTP status the REST service answers with.
    :param type_: A short name for the error, for API clients.
    :param message: The message for the registrant, translatable.
    """

    def __init__(self, status: int, type_: str, message: Message | str) -> None:
        super().__init__(message)
        self.status = status
        self.type = type_
        self.message = message


def _set_owner(attendee: Attendee, user_id: str | None) -> None:
    """Make an account, and only that account, the owner of a registration.

    :param attendee: The Attendee.
    :param user_id: The account; ``None`` leaves the Attendee without owner.
    """
    local_roles = dict(attendee.get_local_roles())
    if local_roles:
        attendee.manage_delLocalRoles(list(local_roles))
    if user_id:
        attendee.manage_setLocalRoles(user_id, ["Owner"])
    attendee.reindexObjectSecurity()


def _account(user: Any) -> dict[str, str]:
    """Return the names and email of an account, to pre-fill a registration.

    :param user: The member.
    :returns: ``first_name``, ``last_name`` and ``email``; the full name is
        split at its first space.
    """
    fullname = (user.getProperty("fullname", "") or "").strip()
    first_name, _sep, last_name = fullname.partition(" ")
    return {
        "first_name": first_name,
        "last_name": last_name.strip(),
        "email": (user.getProperty("email", "") or "").strip(),
    }


def registration_status(container: Attendees) -> dict[str, Any]:
    """Describe whether, and how, an event takes registrations.

    :param container: The Attendees container of the event.
    :returns: The state of the container, whether it takes registrations,
        the deadline and the settings a registration form needs.
    """
    closes_at = container.closes_at()
    return {
        "state": api.content.get_state(container),
        "open": container.is_open,
        "closes_at": json_compatible(closes_at) if closes_at else None,
        "expired": container.expired,
        "allow_anonymous_registration": bool(container.allow_anonymous_registration),
        "registration_confirmation": container.registration_confirmation,
    }


def serialize_registration(attendee: Attendee) -> dict[str, Any]:
    """Describe a registration for its registrant.

    :param attendee: The Attendee.
    :returns: The registration code, state and personal data. ``@id`` only
        when the current user organizes the Attendees container.
    """
    data: dict[str, Any] = {
        "code": attendee.getId(),
        "state": api.content.get_state(attendee),
        "first_name": attendee.first_name,
        "last_name": attendee.last_name,
        "email": attendee.email,
        "email_verified": bool(attendee.email_verified),
    }
    if is_organizer(attendee.__parent__):
        data["@id"] = attendee.absolute_url()
    return data


def link_registration(container: Attendees, user: Any) -> Attendee | None:
    """Return the registration of an account, linking it when needed.

    A registration made without an account, whose email address was
    verified and is the account's, becomes the account's. An unverified
    address is never linked: anyone can type someone else's address.

    :param container: The Attendees container of the event.
    :param user: The member.
    :returns: The Attendee of the account, or ``None``.
    """
    user_id = user.getId()
    for brain in find_attendees(container, attendee_user_id=user_id):
        return brain._unrestrictedGetObject()
    email = normalize_email(user.getProperty("email", ""))
    if not email:
        return None
    for brain in find_attendees(container, attendee_email=email):
        attendee = brain._unrestrictedGetObject()
        if attendee.user_id or not attendee.email_verified:
            continue
        attendee.user_id = user_id
        _set_owner(attendee, user_id)
        attendee.reindexObject()
        return attendee
    return None


def account_defaults(user: Any) -> dict[str, str]:
    """Return what a registration form pre-fills for an account.

    :param user: The member.
    :returns: ``first_name``, ``last_name`` and ``email``.
    """
    return _account(user)


def _check_open(container: Attendees) -> None:
    """Refuse a registration when the event does not take any.

    :param container: The Attendees container of the event.
    :raises RegistrationError: ``403`` when the container is not open, or
        its deadline passed.
    """
    if api.content.get_state(container) != OPEN_STATE:
        raise RegistrationError(
            403, "RegistrationClosed", _("Registration is not open.")
        )
    if container.expired:
        raise RegistrationError(
            403,
            "RegistrationDeadlinePassed",
            _("The registration deadline has passed."),
        )


def _clean(data: dict[str, Any], defaults: dict[str, str]) -> dict[str, str]:
    """Validate the personal data of a registration.

    :param data: The data sent by the registrant.
    :param defaults: Values for what the registrant left out.
    :returns: ``first_name``, ``last_name`` and ``email``, stripped.
    :raises RegistrationError: ``400`` for a missing or invalid value.
    """
    cleaned: dict[str, str] = {}
    for name in ("first_name", "last_name", "email"):
        value = data.get(name)
        if value is None:
            value = defaults.get(name, "")
        if not isinstance(value, str) or not value.strip():
            raise RegistrationError(
                400,
                "BadRequest",
                _("Missing value: ${field}", mapping={"field": name}),
            )
        cleaned[name] = value.strip()
    try:
        EMAIL_FIELD.validate(cleaned["email"])
    except ValidationError:
        raise RegistrationError(
            400, "BadRequest", _("Invalid email address.")
        ) from None
    return cleaned


def register(container: Attendees, data: dict[str, Any]) -> Attendee:
    """Register the current user, or an anonymous visitor, for an event.

    :param container: The Attendees container of the event.
    :param data: ``first_name``, ``last_name`` and ``email``. For a logged-in
        user, each defaults to the account's.
    :returns: The new Attendee.
    :raises RegistrationError: ``403`` when registration is not open or the
        deadline passed, ``401`` for an anonymous visitor when the event
        only takes registrations from accounts, ``400`` for invalid data,
        ``409`` for a duplicate.
    """
    _check_open(container)
    anonymous = api.user.is_anonymous()
    if anonymous and not container.allow_anonymous_registration:
        raise RegistrationError(
            401, "Unauthorized", _("Log in to register for this event.")
        )
    user = None if anonymous else api.user.get_current()
    account = _account(user) if user is not None else {}
    cleaned = _clean(data, account)
    user_id = user.getId() if user is not None else None
    if message := duplicate_message(container, email=cleaned["email"], user_id=user_id):
        raise RegistrationError(409, "Conflict", message)
    # The address of an account counts as verified
    email_verified = bool(account) and normalize_email(
        account["email"]
    ) == normalize_email(cleaned["email"])
    with api.env.adopt_roles(["Manager"]):
        # The title only lets plone.api call the name chooser, which names
        # the Attendee with a registration code; the title itself is computed
        attendee = api.content.create(
            container=container,
            type="Attendee",
            title=f"{cleaned['first_name']} {cleaned['last_name']}",
            first_name=cleaned["first_name"],
            last_name=cleaned["last_name"],
            email=cleaned["email"],
            user_id=user_id,
            email_verified=email_verified,
        )
        _set_owner(attendee, user_id)
    policy = container.registration_confirmation
    if anonymous or policy == CONFIRMATION_EMAIL:
        send_verification(attendee)
    return attendee


def cancel(container: Attendees) -> Attendee:
    """Cancel the registration of the current user.

    :param container: The Attendees container of the event.
    :returns: The cancelled Attendee.
    :raises RegistrationError: ``401`` for an anonymous visitor, ``404``
        without a registration, ``409`` when it can no longer be cancelled.
    """
    if api.user.is_anonymous():
        raise RegistrationError(
            401, "Unauthorized", _("Log in to cancel your registration.")
        )
    attendee = link_registration(container, api.user.get_current())
    if attendee is None:
        raise RegistrationError(
            404, "NotFound", _("You are not registered for this event.")
        )
    if api.content.get_state(attendee) not in CANCELLABLE_STATES:
        raise RegistrationError(
            409, "Conflict", _("This registration can no longer be cancelled.")
        )
    # The owner may cancel: the workflow guard checks the current user
    api.content.transition(obj=attendee, transition="cancel")
    return attendee


def verify(container: Attendees, token: str) -> Attendee:
    """Verify the email address of a registration, from the emailed link.

    Under the ``automatic`` and ``email`` policies, this also confirms the
    registration. Under ``manual``, it waits for an organizer.

    :param container: The Attendees container of the event.
    :param token: The token from the link.
    :returns: The Attendee.
    :raises RegistrationError: ``400`` for an invalid or expired token, or
        one for another event.
    """
    invalid = RegistrationError(
        400, "InvalidToken", _("This link is invalid or has expired.")
    )
    try:
        uid = read_token(token)
    except InvalidToken:
        raise invalid from None
    brains = list(api.content.find(UID=uid, portal_type="Attendee", unrestricted=True))
    if not brains:
        raise invalid
    attendee = brains[0]._unrestrictedGetObject()
    if attendee.__parent__.UID() != container.UID():
        raise invalid
    if not attendee.email_verified:
        attendee.email_verified = True
        attendee.reindexObject()
    policy = container.registration_confirmation
    confirms = policy in (CONFIRMATION_AUTOMATIC, CONFIRMATION_EMAIL)
    if confirms and api.content.get_state(attendee) == "pending":
        with api.env.adopt_roles(["Manager"]):
            api.content.transition(obj=attendee, transition="confirm")
    return attendee
