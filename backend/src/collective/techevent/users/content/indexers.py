"""Catalog indexers for Attendees.

Both indexes have no metadata column, so search results never carry an
attendee's email address or account.
"""

from collective.techevent.users.content.attendee import IAttendee
from collective.techevent.users.utils import normalize_email
from plone.indexer.decorator import indexer
from typing import Any


@indexer(IAttendee)
def attendee_email_indexer(obj: Any) -> str:
    """Index the email address, normalized for comparison."""
    return normalize_email(obj.email)


@indexer(IAttendee)
def attendee_user_id_indexer(obj: Any) -> str:
    """Index the account the registration belongs to.

    :raises AttributeError: Without an account, so nothing is indexed.
    """
    if not obj.user_id:
        raise AttributeError("user_id")
    return obj.user_id
