"""Fixtures for the upgrade step tests."""

from collective.techevent import PACKAGE_NAME
from plone import api

import pytest


@pytest.fixture
def demo_portal(portal):
    """Return the portal with the demo content, which the steps act on.

    :param portal: The Plone site.
    :returns: The same site, with the demo profile applied.
    """
    with api.env.adopt_roles(["Manager"]):
        portal.portal_setup.runAllImportStepsFromProfile(f"{PACKAGE_NAME}:demo")
    return portal
