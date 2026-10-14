"""Summary metadata for the conference listings."""

from plone.restapi.interfaces import IJSONSummarySerializerMetadata
from zope.interface import implementer


@implementer(IJSONSummarySerializerMetadata)
class JSONSummarySerializerMetadata:
    """Additional metadata to be exposed on listings."""

    def default_metadata_fields(self) -> set[str]:
        """Return the metadata fields exposed on every listing.

        :returns: The metadata field names.
        """
        return {"image_field", "image_scales", "effective", "Subject"}
