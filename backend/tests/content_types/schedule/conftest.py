from plone import api
from plone.dexterity.content import DexterityContent

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
