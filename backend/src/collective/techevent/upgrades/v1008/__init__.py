"""Upgrade to profile version 1008: the socialmedia ``social_links`` column.

plonegovbr.socialmedia 3.0 catalogues the links of every object in a
``social_links`` metadata column, and its own profile version 1001 creates
that column and fills it. A site that has the add-on at 1000 needs that step,
and the step is run from here, because the add-on's upgrade is not reached
through this package's profile.
"""

from collective.techevent import logger
from plonegovbr.socialmedia.upgrades.v1001 import add_social_links_column
from Products.GenericSetup.tool import SetupTool


#: The socialmedia profile whose version this step brings up to date.
SOCIALMEDIA_PROFILE = "plonegovbr.socialmedia:default"

#: The socialmedia profile version that creates the ``social_links`` column.
SOCIALMEDIA_VERSION = 1001


def upgrade_social_links(setup_tool: SetupTool) -> None:
    """Run the socialmedia 1001 step on a site that has it at an older version.

    A site without socialmedia installed is left alone, since the step would
    fill a column of a catalog the add-on never set up.

    :param setup_tool: The ``portal_setup`` tool.
    """
    current = setup_tool.getLastVersionForProfile(SOCIALMEDIA_PROFILE)
    if current == "unknown":
        logger.info("%s is not installed, nothing to upgrade.", SOCIALMEDIA_PROFILE)
        return
    # GenericSetup keeps the version as a tuple of parts, e.g. ("1000",).
    if int("".join(current)) >= SOCIALMEDIA_VERSION:
        logger.info("%s is at %s, nothing to upgrade.", SOCIALMEDIA_PROFILE, current)
        return
    add_social_links_column(setup_tool)
    setup_tool.setLastVersionForProfile(SOCIALMEDIA_PROFILE, str(SOCIALMEDIA_VERSION))
    logger.info("Upgraded %s to %s.", SOCIALMEDIA_PROFILE, SOCIALMEDIA_VERSION)
