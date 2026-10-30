"""Subscribers for the Attendees container and its Attendees."""

from collective.techevent import PACKAGE_NAME
from collective.techevent.users.content.attendee import Attendee
from collective.techevent.users.content.attendees import Attendees
from collective.techevent.users.content.attendees import CONFIRMATION_AUTOMATIC
from collective.techevent.users.content.blocks import add_default_blocks
from collective.techevent.users.emails import send_confirmation
from collective.techevent.utils import find_event_root
from collective.techevent.utils import modify_permission
from plone import api
from Products.CMFCore.interfaces import IActionSucceededEvent
from zope.lifecycleevent.interfaces import IObjectAddedEvent

import transaction


ADD_ATTENDEES_PERMISSION = f"{PACKAGE_NAME}: Add Attendees Database"


def impose_limit(attendees: Attendees, event: IObjectAddedEvent) -> None:
    """Allow a single Attendees container per event root.

    :param attendees: The Attendees container being added.
    :param event: The object added event (unused).
    """
    event_root = find_event_root(attendees)
    modify_permission(event_root, ADD_ATTENDEES_PERMISSION, roles=[])


def registration_page(attendees: Attendees, event: IObjectAddedEvent) -> None:
    """Make a new Attendees container a registration page.

    The Volto add form sends the blocks of the page; a container added any
    other way gets a title block and the registration block.

    :param attendees: The Attendees container being added.
    :param event: The object added event (unused).
    """
    add_default_blocks(attendees)


def confirm_automatically(attendee: Attendee, event: IObjectAddedEvent) -> None:
    """Confirm a registration at once, when the container's policy allows it.

    Only registrations made by someone logged in are confirmed this way.
    Anonymous ones wait for the registrant to verify the email address.

    :param attendee: The Attendee being added.
    :param event: The object added event.
    """
    container = event.newParent
    policy = getattr(container, "registration_confirmation", None)
    if policy != CONFIRMATION_AUTOMATIC or api.user.is_anonymous():
        return
    if api.content.get_state(attendee) != "pending":
        return
    with api.env.adopt_roles(["Manager"]):
        api.content.transition(obj=attendee, transition="confirm")


def confirmed(attendee: Attendee, event: IActionSucceededEvent) -> None:
    """Email the registration code once a registration is confirmed.

    The email is composed just before the transaction commits: an Attendee
    confirmed as it is added may still be renamed to its registration code
    (``plone.api`` adds content under a temporary id, then renames it). The
    mail host sends it only if the transaction commits.

    :param attendee: The Attendee whose state changed.
    :param event: The workflow event.
    """
    if event.action == "confirm":
        transaction.get().addBeforeCommitHook(send_confirmation, (attendee,))
