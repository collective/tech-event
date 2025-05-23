from plone.dexterity.content import DexterityContent

import pytest


@pytest.fixture
def container(portal, content_factory, payloads) -> DexterityContent:
    parent = "SponsorsDB"
    payload = payloads[parent][0]
    content = content_factory(portal, payload)
    return content


@pytest.fixture
def container_level(container, content_factory, payloads) -> DexterityContent:
    parent = "SponsorLevel"
    payload = payloads[parent][0]
    content = content_factory(container, payload)
    return content
