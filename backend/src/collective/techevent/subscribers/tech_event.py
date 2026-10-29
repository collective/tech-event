from collective.techevent.content.tech_event import TechEvent
from collective.techevent.utils import setup_tech_event_permissions
from zope.lifecycleevent.interfaces import IObjectAddedEvent


def added_handler(tech_event: TechEvent, _event: IObjectAddedEvent) -> None:
    """Grant the add permissions for the content of a new Tech Event.

    :param tech_event: The Tech Event being added.
    :param _event: The object added event (unused).
    """
    setup_tech_event_permissions(tech_event)
