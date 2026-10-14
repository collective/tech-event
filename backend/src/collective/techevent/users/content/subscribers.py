from collective.techevent.users.content import BaseUser
from collective.techevent.users.content import IBaseUser
from zope.component import adapter
from zope.lifecycleevent.interfaces import IObjectCreatedEvent

import pyotp


@adapter(IBaseUser, IObjectCreatedEvent)  # type: ignore[type-var]  # zope.component.adapter accepts functions; plone-stubs types it for classes only
def generate_pyotp_shared_secret(user: BaseUser, event: IObjectCreatedEvent) -> None:
    """Generate and save a pyotp shared secret on the attendee instance.

    :param user: The created user.
    :param event: The object created event (unused).
    """
    user.totp_seed = pyotp.random_base32()
