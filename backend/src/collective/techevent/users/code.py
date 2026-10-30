"""Registration codes, the ids of Attendees.

A registration code is ``<PREFIX>-<CODE>``: the prefix of the Attendees
container, then 8 characters from an alphabet without the letters people
confuse with digits or with each other (Crockford's base32: no I, L, O, U).
That gives about 10¹² codes per prefix, so a code cannot be guessed by
enumeration, and it is still easy to read out at a registration desk.
"""

from collections.abc import Container
from typing import Any
from zope.container.interfaces import INameChooser
from zope.interface import implementer

import re
import secrets


ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

CODE_LENGTH = 8

MAX_ATTEMPTS = 10

PREFIX_PATTERN = re.compile(r"^[A-Z0-9]{2,12}$")


class CodeGenerationError(RuntimeError):
    """No free registration code was found."""


def generate_code(prefix: str) -> str:
    """Return a new registration code.

    :param prefix: The prefix of the Attendees container.
    :returns: ``<PREFIX>-<CODE>``.
    """
    code = "".join(secrets.choice(ALPHABET) for _ in range(CODE_LENGTH))
    return f"{prefix}-{code}"


def generate_free_code(prefix: str, taken: Container[str]) -> str:
    """Return a registration code that is not taken yet.

    :param prefix: The prefix of the Attendees container.
    :param taken: The ids already in use, usually the container itself.
    :returns: ``<PREFIX>-<CODE>``, not in ``taken``.
    :raises CodeGenerationError: When every attempt hit a taken code.
    """
    for _ in range(MAX_ATTEMPTS):
        code = generate_code(prefix)
        if code not in taken:
            return code
    raise CodeGenerationError(f"No free registration code after {MAX_ATTEMPTS} tries.")


def prefix_from_id(value: str) -> str:
    """Derive a registration prefix from an id, such as an event root's.

    :param value: The id to derive the prefix from.
    :returns: Its letters and digits, upper case, cut to 12 characters, and
        padded with ``X`` to the minimum of 2.
    """
    prefix = re.sub(r"[^A-Z0-9]", "", value.upper())[:12]
    return prefix.ljust(2, "X")


@implementer(INameChooser)
class AttendeeNameChooser:
    """Name an Attendee with a registration code.

    The name suggested by the caller, derived from the title, is ignored:
    an Attendee is always named with a new registration code. An explicit
    id never reaches the name chooser, so ids chosen by a sync script are
    kept.
    """

    def __init__(self, context: Any) -> None:
        """Store the Attendees container.

        :param context: The Attendees container.
        """
        self.context = context

    def checkName(self, name: str, obj: Any) -> bool:
        """Check that a name is free in the container.

        :param name: The name to check.
        :param obj: The object to be named (unused).
        :returns: ``True`` when the name is free.
        :raises KeyError: When the name is taken.
        """
        if name in self.context:
            raise KeyError(name)
        return True

    def chooseName(self, name: str | None, obj: Any) -> str:
        """Return a new registration code.

        :param name: The suggested name (ignored).
        :param obj: The Attendee to be named (unused).
        :returns: A free registration code. A container without a prefix,
            which only code can create, uses one derived from its own id.
        """
        prefix = getattr(self.context, "registration_prefix", None)
        prefix = prefix or prefix_from_id(self.context.getId())
        return generate_free_code(prefix, self.context)
