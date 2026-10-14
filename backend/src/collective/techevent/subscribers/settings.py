"""Apply the control panel settings when they change.

Saving the Tech Event control panel stores ``support_multiple_events`` in the
registry. Nothing else reads that record, so without this handler the
"Tech Event" content type would only follow the setting when the profile is
installed.
"""

from collective.techevent import logger
from collective.techevent.utils import setup_tech_event
from plone import api
from plone.registry.interfaces import IRecordModifiedEvent


#: Registry record that enables the "Tech Event" content type.
SUPPORT_MULTIPLE_EVENTS = "collective.techevent.settings.support_multiple_events"


def settings_modified_handler(event: IRecordModifiedEvent) -> None:
    """Reapply the event setup when ``support_multiple_events`` changes.

    :param event: The registry event. Only changes to
        :data:`SUPPORT_MULTIPLE_EVENTS` do anything; every other record is
        ignored.
    """
    if event.record.__name__ != SUPPORT_MULTIPLE_EVENTS:
        return
    logger.info(
        "%s changed to %s, applying the event setup.",
        SUPPORT_MULTIPLE_EVENTS,
        event.newValue,
    )
    setup_tech_event(api.portal.get())
