"""Serializers for the Presenter content type."""

from collections import defaultdict
from collections.abc import Callable
from collective.techevent.content.presenter import IPresenter
from collective.techevent.utils.vocabularies import get_vocabulary_for_attr
from plone.restapi.interfaces import ISerializeToJson
from plone.restapi.interfaces import ISerializeToJsonSummary
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxcontent import SerializeToJson
from plone.restapi.serializer.summary import DefaultJSONSummarySerializer
from typing import Any
from typing import cast
from zope.component import adapter
from zope.component import getMultiAdapter
from zope.component import getUtility
from zope.interface import implementer
from zope.interface import Interface
from zope.schema.interfaces import IVocabulary
from zope.schema.interfaces import IVocabularyFactory
from zope.schema.vocabulary import SimpleTerm
from zope.schema.vocabulary import SimpleVocabulary


@implementer(ISerializeToJsonSummary)
@adapter(IPresenter, Interface)
class PresenterJSONSummarySerializer(DefaultJSONSummarySerializer):
    """ISerializeToJsonSummary adapter for the Presenter."""

    def __call__(self) -> dict[str, Any]:
        """Return the summary, adding the labels and social links.

        :returns: The JSON summary of the presenter.
        """
        summary = super().__call__()
        summary["labels"] = self.context.labels
        summary["social_links"] = self.context.social_links
        return summary


@implementer(ISerializeToJson)
@adapter(IPresenter, Interface)
class PresenterJSONSerializer(SerializeToJson):
    """ISerializeToJson adapter for the Presenter."""

    def group_activities(self) -> list[dict[str, Any]]:
        """Group the presenter activities by portal type.

        :returns: The grouped activities, in display order.
        """
        # portal_type always has a vocabulary in ATTRIBUTE_VOCABULARY.
        vocabulary = cast(
            IVocabulary, get_vocabulary_for_attr("portal_type", self.context)
        )
        activities = []
        raw_activities = defaultdict(list)
        for activity in self.context.activities:
            serializer = cast(
                Callable[[], dict[str, Any]],
                getMultiAdapter((activity, self.request), ISerializeToJsonSummary),
            )
            raw_activities[activity.portal_type].append(serializer())

        # Review this
        for portal_type in ["Keynote", "Training", "Talk"]:
            if portal_type not in raw_activities:
                continue
            term = vocabulary.getTerm(portal_type)  # type: ignore[attr-defined]  # zope-stubs omit getTerm
            friendly_name = term.title if term else portal_type
            activities.append({
                "@id": portal_type,
                "@type": portal_type,
                "title": friendly_name,
                "items": raw_activities[portal_type],
            })
        return activities

    def serialize_term(self, term: SimpleTerm) -> dict[str, Any]:
        """Given a simple term, serialize the object.

        :param term: The vocabulary term to serialize.
        :returns: The JSON representation of the term.
        """
        serializer = cast(
            Callable[[], dict[str, Any]],
            getMultiAdapter((term, self.request), ISerializeToJson),
        )
        return serializer()

    def get_labels(self) -> list[dict[str, Any]]:
        """Return the serialized labels of the presenter.

        :returns: The serialized labels.
        """
        raw_labels = self.context.labels
        labels = []
        vocab: SimpleVocabulary = getUtility(
            IVocabularyFactory, "collective.techevent.vocabularies.presenter_labels"
        )(self)
        for label in raw_labels:
            # by_token exists at runtime; zope-stubs omit it
            labels.append(self.serialize_term(vocab.by_token[label]))  # type: ignore[attr-defined]
        return labels

    def __call__(
        self,
        version: Any = None,
        include_items: bool = True,
        include_expansion: bool = True,
    ) -> dict[str, Any]:
        """Serialize the presenter, adding activities and labels.

        :param version: The object version to serialize.
        :param include_items: Whether to include the items of folderish content.
        :param include_expansion: Whether to expand the relations.
        :returns: The JSON representation of the presenter.
        """
        result = super().__call__(version, include_items, include_expansion)
        result.update(
            json_compatible({
                "activities": self.group_activities(),
                "labels": self.get_labels(),
            })
        )
        return result
