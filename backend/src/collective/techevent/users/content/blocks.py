"""Default blocks of an Attendees container: its registration page."""

from typing import Any

import uuid


REGISTRATION_BLOCK = "eventRegistration"


def default_blocks() -> tuple[dict[str, Any], dict[str, Any]]:
    """Return the blocks of a new registration page: a title and the form.

    :returns: The ``blocks`` and ``blocks_layout`` values.
    """
    title_id = str(uuid.uuid4())
    registration_id = str(uuid.uuid4())
    blocks = {
        title_id: {"@type": "title"},
        registration_id: {"@type": REGISTRATION_BLOCK},
    }
    return blocks, {"items": [title_id, registration_id]}


def add_default_blocks(container: Any) -> bool:
    """Give an Attendees container the default blocks, if it has none.

    :param container: The Attendees container.
    :returns: ``True`` when the blocks were added.
    """
    if getattr(container, "blocks", None):
        return False
    container.blocks, container.blocks_layout = default_blocks()
    return True
