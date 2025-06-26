from collective.techevent import logger
from collective.techevent.content.schedule.schedule import Schedule
from collective.techevent.utils.permissions import modify_schedule_permissions


def schedule_added_handler(content: Schedule, event):
    """Modify permissions inside the Schedule object to allow adding activities."""
    modify_schedule_permissions(content)
    logger.info(
        f"Modified permissions on {content.id} to allow activities inside subfolders."
    )
