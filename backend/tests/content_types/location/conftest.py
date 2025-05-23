from plone.dexterity.content import DexterityContent

import pytest


@pytest.fixture
def container(portal, content_factory, payloads) -> DexterityContent:
    parent = "Venue"
    payload = payloads[parent][0]
    content = content_factory(portal, payload)
    return content
