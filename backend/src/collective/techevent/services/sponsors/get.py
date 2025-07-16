from collections import defaultdict
from collective.techevent import _types as t
from collective.techevent.content.sponsors.sponsor_level import SponsorLevel
from collective.techevent.content.sponsors.sponsors_db import SponsorsDB
from collective.techevent.utils import find_sponsors_db
from collective.techevent.utils import sponsor_levels
from plone import api
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.services import Service
from zope.component import getMultiAdapter


class GetSponsors(Service):
    """List Sponsors by level."""

    def get_benefits(
        self, sponsors_db: SponsorsDB, levels: list[SponsorLevel]
    ) -> list[dict[str, str]]:
        """Return all published sponsors, grouped by level."""
        all_benefits = {
            benefit["id"]: {
                "title": benefit["title"],
                "description": benefit["description"],
                "levels": {},
            }
            for benefit in sponsors_db.benefits
        }
        for level in levels:
            benefits = level.benefits
            for benefit in benefits:
                code = benefit["code"]
                value = benefit["value"]
                if code not in all_benefits:
                    continue
                all_benefits[code]["levels"][level.id] = value
        benefits_list = [{"id": key, **value} for key, value in all_benefits.items()]
        return benefits_list

    def get_sponsors(self, sponsors_db: SponsorsDB) -> dict[str, list[dict[str, str]]]:
        """Return all published sponsors, grouped by level."""
        response = defaultdict(list)
        results = api.content.find(
            sponsors_db,
            portal_type="Sponsor",
            review_state="published",
            sort_on="getObjPositionInParent",
        )
        for brain in results:
            serializer = getMultiAdapter(
                (brain, self.request),
                interface=ISerializeToJsonSummary,
            )
            serialized = serializer()
            response[brain.level].append(serialized)
        return response

    def reply(self) -> t.APISponsorsLevels:
        """Published sponsors, grouped by level.

        :returns: Sponsors grouped by level.
        """
        sponsors_db = find_sponsors_db(self.context)
        all_sponsors = self.get_sponsors(sponsors_db)
        raw_levels = []
        levels = []
        for level, image_scales in sponsor_levels(sponsors_db):
            raw_levels.append(level)
            key = level.id
            title = level.title
            url = level.absolute_url()
            sponsors = all_sponsors.get(key, [])
            levels.append(
                json_compatible({
                    "@id": url,
                    "id": key,
                    "title": title,
                    "items": sponsors,
                    "has_sponsors": bool(sponsors),
                    "exclude_from_nav": level.exclude_from_nav,
                    "image_scales": image_scales,
                })
            )
        return json_compatible({
            "@id": sponsors_db.absolute_url(),
            "items": levels,
            "benefits": self.get_benefits(sponsors_db, raw_levels),
        })
