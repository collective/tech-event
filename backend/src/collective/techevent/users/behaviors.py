from collective.techevent.users.content import IBaseUser
from collective.techevent.users.utils import verify_totp_code
from datetime import datetime
from datetime import timedelta
from plone import api
from Products.membrane import interfaces as ifaces
from zope.component import adapter
from zope.interface import implementer


ALLOWED_STATES = [
    "registered",
]


@adapter(IBaseUser)
@implementer(ifaces.IMembraneUserAuth)
class MembraneUserAuthentication:
    def __init__(self, context):
        self.user = context

    def verifyCredentials(self, credentials: dict[str, str]) -> bool:
        """Returns True is password is authenticated, False if not."""
        user = self.user

        # Initialize _v_totp_guess if not present
        if not hasattr(user, "_v_totp_guess"):
            user._v_totp_guess = []

        # Check if the last 5 wrong trials are within the last minute
        now = datetime.now()
        user._v_totp_guess = [
            ts for ts in user._v_totp_guess if now - ts < timedelta(seconds=60)
        ]
        if len(user._v_totp_guess) >= 5:
            return False

        if not verify_totp_code(user.totp_seed, credentials.get("password", "")):
            # Add current timestamp to _v_totp_guess for failed trials
            user._v_totp_guess.append(now)
            return False

        return True

    def authenticateCredentials(
        self, credentials: dict[str, str]
    ) -> tuple[str, str] | None:
        # Should not authenticate when the user is not enabled.
        user = self.user
        state = api.content.get_state(user)
        if state not in ALLOWED_STATES:
            return None
        if self.verifyCredentials(credentials):
            return (user.getUserId(), user.getUserName())
