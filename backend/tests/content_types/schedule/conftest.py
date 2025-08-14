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


@pytest.fixture
def enable_presenter_roles():
    def func(portal: DexterityContent, portal_type: str):
        with api.env.adopt_roles(["Manager"]):
            fti = portal.portal_types.get(portal_type)
            if fti:
                behaviors = list(fti.behaviors)
                if "collective.techevent.presenter_roles" not in behaviors:
                    behaviors.append("collective.techevent.presenter_roles")
                    fti.behaviors = tuple(behaviors)
        return fti

    return func
