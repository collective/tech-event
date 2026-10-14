from collective.techevent import logger
from collective.techevent.content.schedule.schedule import Schedule
from collective.techevent.utils.permissions import modify_schedule_permissions
from zope.lifecycleevent.interfaces import IObjectAddedEvent


def schedule_added_handler(content: Schedule, event: IObjectAddedEvent) -> None:
    """Modify permissions inside the Schedule object to allow adding activities.

    :param content: The newly added Schedule.
    :param event: The object added event (unused).
    """
    modify_schedule_permissions(content)
    logger.info(
        f"Modified permissions on {content.id} to allow activities inside subfolders."
    )
