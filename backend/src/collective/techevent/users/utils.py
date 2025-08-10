from AccessControl import Unauthorized
from collective.techevent import _
from collective.techevent import logger
from plone import api
from plone.dexterity.content import DexterityContent
from plone.keyring.interfaces import IKeyManager
from Products.membrane.config import TOOLNAME
from zope.component import getUtility

import base64
import datetime
import pyotp


def get_brains_for_email(context: DexterityContent, email: str, request=None) -> list:
    """Anonymous users should be able to look for email addresses.
    Otherwise they cannot log in.

    This searches in the membrane_tool and returns brains with this
    email address.  Hopefully the result is one or zero matches.

    Note that we search for exact_getUserName as the email address is
    supposed to be used a login name (user name).
    """
    try:
        email = email.strip()
    except (ValueError, AttributeError):
        return []
    if email == "" or "@" not in email:
        return []

    user_catalog = api.portal.get_tool(TOOLNAME)
    if user_catalog is None:
        logger.warning("Membrane_tool not found.")
        return []

    kw = {"exact_getUserName": email}
    users = user_catalog.unrestrictedSearchResults(**kw)
    return users


def get_user_id_for_email(context: DexterityContent, email: str) -> str:
    brains = get_brains_for_email(context, email)
    if len(brains) == 1:
        return brains[0].getUserId
    return ""


def validate_unique_email(email: str, context: DexterityContent | None = None) -> str:
    """Validate this email as unique in the site."""
    context = context if context else api.portal.get()
    matches = get_brains_for_email(context, email)
    if not matches:
        # This email is not used yet.  Fine.
        return ""
    if len(matches) > 1:
        msg = _(f"Multiple matches on email ${email}.", mapping={"email": email})
        logger.warning(msg)
        return msg
    # Might be this member, being edited.  That should have been
    # caught by our new invariant though, at least when changing the
    # email address through the edit interface instead of a
    # personalize_form.
    match = matches[0]
    try:
        found = match.getObject()
    except (AttributeError, KeyError, Unauthorized):
        # This is suspicious.  Best not to use this one.
        pass
    else:
        if found == context:
            # We are the only match.  Good.
            logger.debug(f"Only this object itself has email {email}")
            return

    # There is a match but it is not this member or we cannot get
    # the object.
    msg = _(f"Email ${email} is already in use.", mapping={"email": email})
    logger.debug(msg)
    return msg


def get_membrane_user(
    context: DexterityContent,
    principal_id: str,
    member_type: str = "Attendee",
    get_object: bool = False,
    unrestricted: bool = False,
):
    catalog = api.portal.get_tool(TOOLNAME)
    if catalog is None:
        logger.debug("Membrane_tool not found.")
        # Probably just the admin user, in which case we can just
        # return nothing.
        return None
    if unrestricted:
        res = catalog.unrestrictedSearchResults(
            exact_getUserId=principal_id, portal_type=member_type
        )
    else:
        res = catalog(exact_getUserId=principal_id, portal_type=member_type)
    if len(res) != 1:
        return None
    brain = res[0]
    if unrestricted:
        return brain._unrestrictedGetObject() if get_object else brain
    else:
        return brain.getObject() if get_object else brain


def create_portal_totp(totp_seed: str) -> pyotp.TOTP:
    """Create a TOTP object for the given seed."""
    manager = getUtility(IKeyManager)
    seed = base64.b32encode((totp_seed + manager.secret()).encode("utf-8"))
    totp = pyotp.TOTP(seed.decode("utf-8"), interval=30)
    return totp


def create_totp_code(totp_seed: str, for_time=None) -> str:
    """Create a TOTP code for the given seed."""
    totp = create_portal_totp(totp_seed)
    if for_time:
        return totp.at(for_time)
    return totp.now()


def verify_totp_code(totp_seed: str, code: str, minutes: int = 10) -> bool:
    """
    Check if the provided TOTP code was valid within the last `minutes` minutes.
    """
    totp = create_portal_totp(totp_seed)
    steps = int((minutes * 60) / totp.interval)
    now = datetime.datetime.now()
    for i in range(steps + 1):
        timestamp = now - datetime.timedelta(seconds=i * totp.interval)
        if totp.verify(code, for_time=timestamp):
            return True
    return False
