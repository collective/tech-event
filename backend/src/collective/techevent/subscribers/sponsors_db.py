from collective.techevent import PACKAGE_NAME
from collective.techevent.content.sponsors.sponsors_db import SponsorsDB
from collective.techevent.utils import find_event_root
from collective.techevent.utils import modify_permission


def impose_limit(sponsors_db: SponsorsDB, event):
    conf_root = find_event_root(sponsors_db)
    permission_id = f"{PACKAGE_NAME}: Add SponsorsDB"
    roles = []
    modify_permission(conf_root, permission_id, roles=roles)
