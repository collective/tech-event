"""Vocabularies of the attendee registration."""

from Acquisition import aq_inner
from Acquisition import aq_parent
from collective.techevent.users.content.attendees import IAttendees
from collective.techevent.users.utils import find_tickets
from typing import Any
from zope.interface import provider
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@provider(IVocabularyFactory)
def tickets(context: Any) -> SimpleVocabulary:
    """List the tickets of an event, whether available now or not.

    :param context: The Attendees container, or an Attendee in it.
    :returns: The tickets, valued by UID, in the order of the container.
    """
    container = context
    if not IAttendees.providedBy(container):
        container = aq_parent(aq_inner(context))
    if not IAttendees.providedBy(container):
        return SimpleVocabulary([])
    return SimpleVocabulary([
        SimpleTerm(brain.UID, token=brain.UID, title=brain.Title)
        for brain in find_tickets(container)
    ])
