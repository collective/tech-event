from collections.abc import Callable
from collections.abc import Generator
from plone import api
from plone.dexterity.content import DexterityContent
from plone.dexterity.schema import SCHEMA_CACHE
from typing import Any

import pytest


@pytest.fixture
def container(portal, content_factory, payloads) -> DexterityContent:
    parent = "Schedule"
    payload = payloads[parent][0]
    content = content_factory(portal, payload)
    return content


@pytest.fixture
def search_slot_event_dates(event_dates):
    start, end = event_dates
    kw = {
        "start": {"query": start, "range": "min"},
        "end": {"query": end, "range": "max"},
    }

    def func(portal_type: str):
        with api.env.adopt_roles(["Manager"]):
            brains = api.content.find(portal_type=portal_type, **kw)
        return brains

    return func


PRESENTER_ROLES_BEHAVIOR = "collective.techevent.presenter_roles"


@pytest.fixture
def enable_presenter_roles() -> Generator[Callable[[DexterityContent, str], Any]]:
    """Return a helper that enables the presenter roles behavior on a type.

    Assigning ``fti.behaviors`` directly does not fire the FTI modified event
    that invalidates ``SCHEMA_CACHE``, a process-wide cache. Without the
    explicit invalidation a schema cached by an earlier test keeps the old
    behaviors, and whether the behavior applies depends on test order.

    :returns: Generator yielding a callable that takes a portal and a portal
        type id, enables the behavior, and returns the FTI.
    """
    changed: list[str] = []

    def func(portal: DexterityContent, portal_type: str) -> Any:
        with api.env.adopt_roles(["Manager"]):
            fti = portal.portal_types.get(portal_type)
            if fti:
                behaviors = list(fti.behaviors)
                if PRESENTER_ROLES_BEHAVIOR not in behaviors:
                    behaviors.append(PRESENTER_ROLES_BEHAVIOR)
                    fti.behaviors = tuple(behaviors)
                    SCHEMA_CACHE.invalidate(fti)
                    changed.append(portal_type)
        return fti

    yield func
    # Forget the enabled schema, so the next test rebuilds it from the FTI.
    for portal_type in changed:
        SCHEMA_CACHE.invalidate(portal_type)
