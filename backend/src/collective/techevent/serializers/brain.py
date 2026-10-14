"""Serializers for catalog brains."""

from collections.abc import Callable
from collective.techevent.interfaces import IBrowserLayer
from collective.techevent.utils.vocabularies import get_vocabulary_for_attr
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from Products.ZCatalog.CatalogBrains import AbstractCatalogBrain
from Products.ZCatalog.interfaces import ICatalogBrain
from typing import Any
from typing import cast
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.interface import implementer
from zope.schema.interfaces import IVocabulary


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class JSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for catalog brains of special portal types."""

    context: AbstractCatalogBrain
    special_portal_types = (
        "Sponsor",
        "Presenter",
        "Keynote",
        "Talk",
        "Training",
    )

    def __call__(self) -> dict[str, Any]:
        """Serialize the brain, using a type-specific serializer when one exists.

        :returns: The JSON summary of the brain.
        """
        context = self.context
        portal_type = context.portal_type
        summary = None
        if portal_type in self.special_portal_types:
            serializer = cast(
                Callable[[], dict[str, Any]],
                getMultiAdapter(
                    (context, self.request),
                    name=portal_type,
                    interface=ISerializeToJsonSummary,
                ),
            )
            summary = serializer() if serializer is not None else None
        if not summary:
            summary = super().__call__()
        return summary


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class BrainSponsorSerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for sponsor catalog brains."""

    context: AbstractCatalogBrain

    @property
    def local_metadatata_fields(self) -> set[str]:
        """Metadata fields specific to sponsors."""
        return {
            "level",
            "image_field",
            "image_scales",
            "social_links",
        }

    def metadata_fields(self) -> set[str]:
        """Return the default metadata fields plus the sponsor-specific ones.

        :returns: The set of metadata field names.
        """
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class BrainPresenterSerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for presenter catalog brains."""

    context: AbstractCatalogBrain

    @property
    def local_metadatata_fields(self) -> set[str]:
        """Metadata fields specific to presenters."""
        return {
            "image_field",
            "image_scales",
            "social_links",
        }

    def metadata_fields(self) -> set[str]:
        """Return the default metadata fields plus the presenter-specific ones.

        :returns: The set of metadata field names.
        """
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields


@implementer(ISerializeToJsonSummary)
@adapter(ICatalogBrain, IBrowserLayer)
class BrainSessionSerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for session catalog brains."""

    context: AbstractCatalogBrain

    @property
    def local_metadatata_fields(self) -> set[str]:
        """Metadata fields specific to sessions."""
        return {
            "image_field",
            "image_scales",
            "description",
            "presenters",
        }

    def metadata_fields(self) -> set[str]:
        """Return the default metadata fields plus the session-specific ones.

        :returns: The set of metadata field names.
        """
        fields = super().metadata_fields()
        return fields | self.local_metadatata_fields

    def __call__(self) -> dict[str, Any]:
        """Serialize the session brain, adding the vocabulary-backed fields.

        :returns: The JSON summary of the session.
        """
        result = super().__call__()
        for field_id in (
            "room",
            "session_track",
            "session_level",
            "session_audience",
            "session_language",
        ):
            context = self.context.getObject()
            # Every attribute listed here has a vocabulary in ATTRIBUTE_VOCABULARY.
            vocabulary = cast(IVocabulary, get_vocabulary_for_attr(field_id, context))
            value = getattr(context, field_id)
            value = {value} if isinstance(value, str) else value
            response = []
            if not value:
                continue
            for item in value:
                term = vocabulary.getTerm(item)  # type: ignore[attr-defined]  # zope-stubs omit getTerm
                response.append({
                    "title": term.title,
                    "token": term.token,
                })
            result[field_id] = response

        return result
