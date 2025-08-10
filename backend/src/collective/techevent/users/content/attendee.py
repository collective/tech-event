from collective.techevent.users.content import BaseUser
from collective.techevent.users.content import IBaseUser
from zope.interface import implementer


class IAttendee(IBaseUser):
    """A attendee in the conference."""


@implementer(IAttendee)
class Attendee(BaseUser):
    """An attendee in the conference."""
