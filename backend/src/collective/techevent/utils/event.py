from Acquisition import aq_parent
from collective.techevent.behaviors.tech_event import Settings
from collective.techevent.content.sponsors.sponsor_level import SponsorLevel
from collective.techevent.content.sponsors.sponsors_db import SponsorsDB
from collective.techevent.interfaces import IEventRoot
from plone import api
from plone.dexterity.content import DexterityContent


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
