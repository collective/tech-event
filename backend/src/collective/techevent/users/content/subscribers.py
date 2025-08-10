from collective.techevent.users.content import IBaseUser
from zope.component import adapter
from zope.lifecycleevent.interfaces import IObjectCreatedEvent

import pyotp


@adapter(IBaseUser, IObjectCreatedEvent)
def generate_pyotp_shared_secret(user, event):
    """Generate and save a pyotp shared secret on the attendee instance."""
    user.totp_seed = pyotp.random_base32()
