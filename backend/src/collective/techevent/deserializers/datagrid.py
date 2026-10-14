"""Deserializers for datagrid fields."""

from collective.techevent.interfaces import IBrowserLayer
from collective.z3cform.datagridfield.interfaces import IRow
from plone.dexterity.interfaces import IDexterityContent
from plone.restapi.deserializer.dxfields import DefaultFieldDeserializer
from plone.restapi.interfaces import IFieldDeserializer
from typing import Any
from zope.component import adapter
from zope.component import queryMultiAdapter
from zope.interface import implementer
from zope.schema import getFields  # type: ignore[attr-defined]  # partial zope-stubs omit getFields
from zope.schema.interfaces import IDatetime


@implementer(IFieldDeserializer)
@adapter(IRow, IDexterityContent, IBrowserLayer)
class DatagridRowDeserializer(DefaultFieldDeserializer):
    """Deserialize the rows of a datagrid field."""

    def __call__(self, row: dict[str, Any]) -> dict[str, Any]:
        """Deserialize a single row, field by field.

        :param row: The raw row value from the request.
        :returns: The deserialized row.
        """
        row_data: dict[str, Any] = {}
        for name, field in list(getFields(self.field.schema).items()):
            if field.readonly:
                continue
            value = row.get(name)
            if hasattr(field, "vocabularyName") and isinstance(value, dict):
                value = value["token"]

            context = self.field if IDatetime.providedBy(field) else self.context

            deserializer = queryMultiAdapter(
                (field, context, self.request), IFieldDeserializer
            )
            default_value = field.default
            if value is None and default_value is not None:
                value = default_value
            elif value is None:
                # Skip empty values, e.g. for non-required fields
                continue

            if deserializer is None:
                # simply add the value
                row_data[name] = value
                continue

            row_data[name] = deserializer(value)
        return row_data
