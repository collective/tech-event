from Acquisition import aq_parent
from collective.techevent import logger
from collective.techevent.behaviors.tech_event import Settings
from collective.techevent.content.sponsors.sponsor_level import SponsorLevel
from collective.techevent.content.sponsors.sponsors_db import SponsorsDB
from collective.techevent.interfaces import IEventRoot
from plone import api
from plone.dexterity.content import DexterityContent
from plone.dexterity.fti import DexterityFTI
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import queryUtility


def find_event_root(context: DexterityContent) -> Settings:
    """Find nearest event root."""
    if IEventRoot.providedBy(context):
        return context
    else:
        return find_event_root(aq_parent(context))


def find_sponsors_db(context: DexterityContent) -> SponsorsDB | None:
    """Find nearest sponsors db."""
    event_root = find_event_root(context)
    brains = api.content.find(event_root, portal_type="SponsorsDB")
    if brains:
        sponsors_db = brains[0].getObject()
        return sponsors_db


def sponsor_levels(context: DexterityContent) -> list[tuple[SponsorLevel, dict]]:
    items = []

    if sponsors_db := find_sponsors_db(context):
        brains = api.content.find(
            sponsors_db, portal_type="SponsorLevel", sort_on="getObjPositionInParent"
        )
        for brain in brains:
            level = brain.getObject()
            level_images = brain.image_scales
            items.append((level, level_images))
    return items


def get_sponsorship_benefits(context: DexterityContent) -> list[dict[str, str]]:
    """Return a list of sponsorship benefits."""
    benefits = []
    if sponsors_db := find_sponsors_db(context):
        benefits = sponsors_db.benefits
    return benefits


PERMISSIONS = [
    "collective.techevent: Add Keynote",
    "collective.techevent: Add Presenter",
    "collective.techevent: Add Venue",
    "collective.techevent: Add Slot",
    "collective.techevent: Add Talk",
    "collective.techevent: Add Training",
]

DEFAULT_ROLES = [
    "Manager",
    "Site Administrator",
    "Owner",
    "Contributor",
]


def _get_fti(portal_type: str) -> DexterityFTI:
    return queryUtility(IDexterityFTI, name=portal_type)


def modify_permission(context: DexterityContent, permission_id: str, roles: list[str]):
    path = context.absolute_url()
    context.manage_permission(permission_id, roles=roles, acquire=False)
    roles = ", ".join(roles)
    logger.info(f"{path}: Set {permission_id} to roles {roles}")


def _modify_tech_event_ct(portal_type: str, enable: bool):
    fti = _get_fti(portal_type)
    if enable and not fti.global_allow:
        fti.global_allow = True
        logger.info(f"Enabled {portal_type}")
    elif fti.global_allow and not enable:
        fti.global_allow = False
        logger.info(f"Disabled {portal_type}")


def _modify_conference_behavior(portal_type: str, enable: bool):
    behavior = "collective.techevent.event_settings"
    fti = _get_fti(portal_type)
    behaviors = list(fti.behaviors)
    if enable and behavior not in behaviors:
        behaviors.append(behavior)
        logger.info(f"Added `{behavior}` to {portal_type}")
    elif behavior in behaviors and not enable:
        behaviors.remove(behavior)
        logger.info(f"Removed `{behavior}` from {portal_type}")
    fti.behaviors = tuple(behaviors)


def _modify_permissions(context: DexterityContent, enable: bool):
    roles = DEFAULT_ROLES if enable else []
    for permission_id in PERMISSIONS:
        modify_permission(context, permission_id, roles)
    # Handle SponsorDB
    permission_id = "collective.techevent: Add SponsorsDB"
    brains = api.content.find(context, portal_type="SponsorsDB")
    if len(brains) == 0:
        modify_permission(context, permission_id, roles)


def setup_tech_event(portal: DexterityContent):
    multiple_events = api.portal.get_registry_record(
        "collective.techevent.settings.support_multiple_events"
    )
    portal = api.portal.get()
    if multiple_events:
        # Remove behavior from Plone Site
        _modify_conference_behavior("Plone Site", False)
        # Enable TechEvent content type
        _modify_tech_event_ct("Tech Event", True)
        # Remove permissions from Plone Site
        _modify_permissions(portal, False)
        # Setup permissions on existing TechEvent instances
    else:
        # Enable behavior for Plone Site
        _modify_conference_behavior("Plone Site", True)
        # Disable TechEvent content type
        _modify_tech_event_ct("Tech Event", False)
        # Add permissions on Plone Site
        _modify_permissions(portal, True)
