"""Helpers for the attendee registration."""

from collective.techevent import _
from plone import api
from plone.uuid.interfaces import IUUID
from typing import Any
from zope.i18nmessageid import Message


# Organizers: those who edit the container, or review its registrations
ORGANIZER_PERMISSIONS = ("Modify portal content", "Review portal content")


def is_organizer(container: Any) -> bool:
    """Whether the current user organizes the registrations of a container.

    The container is public while registration is open, so viewing it does
    not make an organizer.

    :param container: The Attendees container.
    :returns: ``True`` when the user can edit the container or review its
        registrations.
    """
    return any(
        api.user.has_permission(permission, obj=container)
        for permission in ORGANIZER_PERMISSIONS
    )


def normalize_email(email: str | None) -> str:
    """Return an email address in the form it is indexed and compared.

    :param email: The email address.
    :returns: The address without surrounding spaces, in lower case.
    """
    return (email or "").strip().lower()


def find_attendees(container: Any, **query: Any) -> list[Any]:
    """Search the Attendees of one container, whatever their state.

    :param container: The Attendees container.
    :param query: Extra catalog criteria.
    :returns: The catalog brains.
    """
    return list(
        api.content.find(
            context=container,
            depth=1,
            portal_type="Attendee",
            unrestricted=True,
            **query,
        )
    )


def find_attendees_container(event_root: Any) -> Any | None:
    """Return the Attendees container of an event root, if it has one.

    There is at most one: adding it revokes the permission to add another.

    :param event_root: The event root: the Plone site, or a Tech Event.
    :returns: The Attendees container, or ``None``.
    """
    brains = api.content.find(
        context=event_root,
        portal_type="Attendees",
        unrestricted=True,
    )
    for brain in brains:
        return brain._unrestrictedGetObject()
    return None


def duplicate_message(
    container: Any,
    email: str | None = None,
    user_id: str | None = None,
    exclude: Any = None,
) -> Message | None:
    """Tell why a registration would duplicate an existing one.

    :param container: The Attendees container.
    :param email: The email address of the registration.
    :param user_id: The account of the registration.
    :param exclude: The Attendee being edited, which does not count.
    :returns: The error message, or ``None`` without a duplicate.
    """
    excluded_uid = IUUID(exclude, None) if exclude is not None else None
    if user_id:
        brains = find_attendees(container, attendee_user_id=user_id)
        if any(excluded_uid != brain.UID for brain in brains):
            return _("You are already registered for this event.")
    if email := normalize_email(email):
        brains = find_attendees(container, attendee_email=email)
        if any(excluded_uid != brain.UID for brain in brains):
            return _("This email is already registered for this event.")
    return None
