"""Signed tokens for the email verification link.

A token carries the UID of an Attendee and an expiry, signed with the site
secret from ``plone.keyring``, so it cannot be forged or extended.
"""

from datetime import datetime
from datetime import timedelta
from datetime import UTC
from plone.keyring.interfaces import IKeyManager
from zope.component import getUtility

import base64
import hashlib
import hmac
import json


TOKEN_LIFETIME = timedelta(hours=48)


class InvalidToken(ValueError):
    """The token is malformed, tampered with, or expired."""


def _encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _decode(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def _signature(payload: str) -> str:
    manager = getUtility(IKeyManager)
    secret: str = manager.secret()  # type: ignore[func-returns-value, assignment]  # plone-stubs types IKeyManager.secret as returning None
    digest = hmac.new(secret.encode("utf-8"), payload.encode("ascii"), hashlib.sha256)
    return _encode(digest.digest())


def create_token(uid: str, now: datetime | None = None) -> str:
    """Create a verification token for an Attendee.

    :param uid: The UID of the Attendee.
    :param now: The time the token is issued; the current time by default.
    :returns: The token, safe to use in a URL.
    """
    now = now or datetime.now(UTC)
    expires = int((now + TOKEN_LIFETIME).timestamp())
    payload = _encode(json.dumps({"uid": uid, "exp": expires}).encode("utf-8"))
    return f"{payload}.{_signature(payload)}"


def read_token(token: str, now: datetime | None = None) -> str:
    """Check a verification token and return the UID it carries.

    :param token: The token.
    :param now: The time of the check; the current time by default.
    :returns: The UID of the Attendee.
    :raises InvalidToken: When the token is malformed, its signature does not
        match, or it expired.
    """
    payload, _, signature = (token or "").partition(".")
    if not payload or not signature:
        raise InvalidToken("Malformed token.")
    if not hmac.compare_digest(signature, _signature(payload)):
        raise InvalidToken("Invalid signature.")
    try:
        data = json.loads(_decode(payload))
        uid = str(data["uid"])
        expires = int(data["exp"])
    except (ValueError, KeyError, TypeError):
        raise InvalidToken("Malformed token.") from None
    now = now or datetime.now(UTC)
    if now.timestamp() >= expires:
        raise InvalidToken("Expired token.")
    return uid
