from AccessControl import Unauthorized
from collective.techevent import _
from collective.techevent import logger
from plone import api
from plone.dexterity.content import DexterityContent
from plone.keyring.interfaces import IKeyManager
from Products.membrane.config import TOOLNAME
from typing import Any
from zope.component import getUtility

import base64
import datetime
import pyotp


def get_brains_for_email(
    context: DexterityContent, email: str, request: object = None
) -> list[Any]:
    """Anonymous users should be able to look for email addresses.
    Otherwise they cannot log in.

    This searches in the membrane_tool and returns brains with this
    email address.  Hopefully the result is one or zero matches.

    Note that we search for exact_getUserName as the email address is
    supposed to be used a login name (user name).

    :param context: Context used to find the membrane tool.
    :param email: Email address to search for.
    :param request: The request (unused).
    :returns: List of catalog brains with this email address.
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
    """Return the user ID for an email address, if it is unique.

    :param context: Context used to find the membrane tool.
    :param email: Email address to search for.
    :returns: The user ID, or an empty string when there is not exactly one match.
    """
    brains = get_brains_for_email(context, email)
    if len(brains) == 1:
        return brains[0].getUserId
    return ""


def validate_unique_email(
    email: str, context: DexterityContent | None = None
) -> str | None:
    """Validate this email as unique in the site.

    :param email: Email address to validate.
    :param context: Object being edited, if any.
    :returns: Empty string or None when valid, otherwise the error message.
    """
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
            return None

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
) -> object | None:
    """Return the membrane user brain (or object) for a principal ID.

    :param context: Context used to find the membrane tool.
    :param principal_id: The user ID.
    :param member_type: Portal type of the user.
    :param get_object: Return the object instead of the brain.
    :param unrestricted: Use unrestricted catalog access.
    :returns: The brain or object, or None when there is not exactly one match.
    """
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
    """Create a TOTP object for the given seed.

    :param totp_seed: The user TOTP seed.
    :returns: The TOTP object, combined with the portal key.
    """
    manager = getUtility(IKeyManager)
    seed = base64.b32encode((totp_seed + manager.secret()).encode("utf-8"))  # type: ignore[func-returns-value, operator]  # plone-stubs types IKeyManager.secret as returning None
    totp = pyotp.TOTP(seed.decode("utf-8"), interval=30)
    return totp


def create_totp_code(
    totp_seed: str, for_time: int | datetime.datetime | None = None
) -> str:
    """Create a TOTP code for the given seed.

    :param totp_seed: The user TOTP seed.
    :param for_time: Time for which the code is generated, now if None.
    :returns: The TOTP code.
    """
    totp = create_portal_totp(totp_seed)
    if for_time:
        return totp.at(for_time)
    return totp.now()


def verify_totp_code(totp_seed: str, code: str, minutes: int = 10) -> bool:
    """
    Check if the provided TOTP code was valid within the last `minutes` minutes.

    :param totp_seed: The user TOTP seed.
    :param code: The TOTP code to verify.
    :param minutes: How many minutes back the code may have been generated.
    :returns: True if the code is valid, False otherwise.
    """
    totp = create_portal_totp(totp_seed)
    steps = int((minutes * 60) / totp.interval)
    now = datetime.datetime.now()
    for i in range(steps + 1):
        timestamp = now - datetime.timedelta(seconds=i * totp.interval)
        if totp.verify(code, for_time=timestamp):
            return True
    return False
