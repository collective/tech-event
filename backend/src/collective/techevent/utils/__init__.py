from collective.techevent import logger
from collective.techevent.utils.event import find_event_root
from collective.techevent.utils.event import find_sponsors_db
from collective.techevent.utils.event import get_sponsorship_benefits
from collective.techevent.utils.event import sponsor_levels
from plone import api
from plone.dexterity.content import DexterityContent
from plone.dexterity.fti import DexterityFTI
from plone.dexterity.interfaces import IDexterityFTI
from zope.component import queryUtility


PERMISSIONS = [
    "collective.techevent: Add Presenter",
    "collective.techevent: Add Venue",
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


def setup_tech_event_users(portal: DexterityContent):
    """Initialize the Attendees content type and container."""
    # Create the Attendees container if it doesn't exist
    if "attendees" not in portal:
        # Get the FTI for Attendees
        fti = _get_fti("Attendees")

        # Enable global_allow for Attendees
        if not fti.global_allow:
            fti.global_allow = True
            logger.info("Enabled global_allow for Attendees")

        try:
            attendees = api.content.create(
                container=portal,
                type="Attendees",
                id="attendees",
                title="Attendees",
            )
            logger.info(f"Created Attendees container at {attendees.absolute_url()}")
        except Exception as e:
            logger.error(f"Failed to create Attendees container: {e}")

        # Disable global_allow for Attendees
        if fti.global_allow:
            fti.global_allow = False
            logger.info("Disabled global_allow for Attendees")


__all__ = [
    "find_event_root",
    "find_sponsors_db",
    "get_sponsorship_benefits",
    "modify_permission",
    "setup_tech_event",
    "setup_tech_event_users",
    "sponsor_levels",
]
