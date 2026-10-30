"""Emails sent to registrants."""

from collective.techevent import _
from collective.techevent import logger
from collective.techevent.users.tokens import create_token
from collective.techevent.utils import find_event_root
from plone import api
from smtplib import SMTPException
from typing import Any
from zope.globalrequest import getRequest
from zope.i18n import translate
from zope.i18nmessageid import Message

import os


VERIFY_ROUTE = "registration/verify"


def frontend_url(context: Any) -> str:
    """Return the URL of a content item in the frontend.

    The frontend may live on another domain than the backend: this uses
    ``VOLTO_FRONTEND_DOMAIN`` or the ``volto.frontend_domain`` record, as
    Plone does for the password reset link, and the backend URL otherwise.

    :param context: The content item.
    :returns: Its URL in the frontend.
    """
    portal = api.portal.get()
    domain = os.environ.get("VOLTO_FRONTEND_DOMAIN") or api.portal.get_registry_record(
        "volto.frontend_domain", default=None
    )
    if not domain:
        return context.absolute_url()
    depth = len(portal.getPhysicalPath())
    path = "/".join(context.getPhysicalPath()[depth:])
    domain = domain.rstrip("/")
    return f"{domain}/{path}" if path else domain


def verification_url(attendee: Any) -> str:
    """Return the link that verifies the email address of a registration.

    :param attendee: The Attendee.
    :returns: The frontend URL of the verification route, with the token.
    """
    event_url = frontend_url(find_event_root(attendee))
    token = create_token(api.content.get_uuid(attendee))
    return f"{event_url}/{VERIFY_ROUTE}?token={token}"


def _send(attendee: Any, subject: Message, body: Message) -> bool:
    """Send an email to a registrant, or log it without a mail host.

    :param attendee: The Attendee to write to.
    :param subject: The subject, translated with the current request.
    :param body: The body, translated with the current request.
    :returns: ``True`` when the email was sent.
    """
    request = getRequest()
    subject_text = translate(subject, context=request)
    body_text = translate(body, context=request)
    try:
        api.portal.send_email(
            recipient=attendee.email,
            subject=subject_text,
            body=body_text,
        )
    except (ValueError, SMTPException) as exc:
        logger.warning(
            f"Could not email {attendee.absolute_url()} ({exc}): {subject_text}"
        )
        return False
    return True


def send_verification(attendee: Any) -> bool:
    """Ask a registrant to verify the email address.

    :param attendee: The Attendee waiting for verification.
    :returns: ``True`` when the email was sent.
    """
    event_title = find_event_root(attendee).title
    subject = _(
        "Confirm your registration for ${event}",
        mapping={"event": event_title},
    )
    body = _(
        "email_verification_body",
        default=(
            "Hello ${name},\n\n"
            "Thank you for registering for ${event}. Please confirm your "
            "email address by following this link within 48 hours:\n\n"
            "${url}\n\n"
            "Your registration code is ${code}.\n\n"
            "If you did not register, ignore this message."
        ),
        mapping={
            "name": attendee.first_name,
            "event": event_title,
            "url": verification_url(attendee),
            "code": attendee.getId(),
        },
    )
    return _send(attendee, subject, body)


def send_confirmation(attendee: Any) -> bool:
    """Tell a registrant that the registration is confirmed.

    :param attendee: The confirmed Attendee.
    :returns: ``True`` when the email was sent.
    """
    event_title = find_event_root(attendee).title
    subject = _(
        "Your registration for ${event} is confirmed",
        mapping={"event": event_title},
    )
    body = _(
        "email_confirmation_body",
        default=(
            "Hello ${name},\n\n"
            "Your registration for ${event} is confirmed.\n\n"
            "Your registration code is ${code}. Please have it with you at "
            "the registration desk."
        ),
        mapping={
            "name": attendee.first_name,
            "event": event_title,
            "code": attendee.getId(),
        },
    )
    return _send(attendee, subject, body)
