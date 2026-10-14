from collective.techevent import PACKAGE_NAME
from collective.techevent.content.sponsors.sponsors_db import SponsorsDB
from collective.techevent.utils import find_event_root
from collective.techevent.utils import modify_permission
from zope.lifecycleevent.interfaces import IObjectAddedEvent


def impose_limit(sponsors_db: SponsorsDB, event: IObjectAddedEvent) -> None:
    """Restrict who can add SponsorsDB content in the event root.

    :param sponsors_db: The SponsorsDB being added.
    :param event: The object added event (unused).
    """
    conf_root = find_event_root(sponsors_db)
    permission_id = f"{PACKAGE_NAME}: Add SponsorsDB"
    roles: list[str] = []
    modify_permission(conf_root, permission_id, roles=roles)
