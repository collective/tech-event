from collective.techevent.fields.datagrid import IDataGrid
from collective.z3cform.datagridfield.interfaces import IRow
from copy import deepcopy
from plone.dexterity.interfaces import IDexterityContent
from plone.restapi.interfaces import IFieldSerializer
from plone.restapi.serializer.converters import json_compatible
from plone.restapi.serializer.dxfields import CollectionFieldSerializer
from plone.restapi.types.adapters import ObjectJsonSchemaProvider
from plone.restapi.types.interfaces import IJsonSchemaProvider
from plone.restapi.types.utils import get_fieldsets
from plone.restapi.types.utils import get_jsonschema_properties
from plone.restapi.types.utils import iter_fields
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface
from zope.schema import getFields
from zope.schema.interfaces import IChoice
from zope.schema.interfaces import IVocabularyTokenized


@adapter(IRow, Interface, Interface)
@implementer(IJsonSchemaProvider)
class DataGridRowJsonSchemaProvider(ObjectJsonSchemaProvider):
    def __init__(self, field, context, request):
        super().__init__(field, context, request)
        self.fieldsets = get_fieldsets(context, request, self.field.schema)

    def get_factory(self):
        return "DataGridField Row"

    def get_properties(self):
        if self.prefix:
            prefix = ".".join([self.prefix, self.field.__name__])
        else:
            prefix = self.field.__name__
        return get_jsonschema_properties(
            self.context, self.request, self.fieldsets, prefix
        )

    def additional(self):
        info = super().additional()
        properties = self.get_properties()
        required = []
        for field in iter_fields(self.fieldsets):
            name = field.field.getName()

            # Determine required fields
            if field.field.required:
                required.append(name)

            # Include field modes
            if field.mode:
                properties[name]["mode"] = field.mode

        info["fieldsets"] = [
            {
                "id": "default",
                "title": "Default",
                "fields": list(properties.keys()),
            },
        ]
        info["required"] = required
        info["properties"] = properties
        return info


@implementer(IFieldSerializer)
@adapter(IDataGrid, IDexterityContent, Interface)
class DataGridSerializer(CollectionFieldSerializer):
    schema_fields: tuple[tuple[str,], ...]
    alias_id: str
    alias_title: str

    def __init__(self, field, context, request):
        self.context = context
        self.request = request
        self.field = field
        self.schema_fields = self._get_schema_fields()
        self.alias_id = field.alias_id or ""
        self.alias_title = field.alias_title or ""

    def _serialize_row_item(self, row_item: dict) -> dict:
        item = deepcopy(row_item)
        fields = self.schema_fields
        for field_name, field_type in fields:
            value = item.get(field_name)
            if (
                value is not None
                and not isinstance(value, dict)
                and IChoice.providedBy(field_type)
                and IVocabularyTokenized.providedBy(field_type.vocabulary)
            ):
                try:
                    term = field_type.vocabulary.getTerm(value)
                    item[field_name] = {"token": term.token, "title": term.title}
                except LookupError:
                    pass
        if self.alias_id and self.alias_id in item:
            item["@id"] = item[self.alias_id]
        if self.alias_title and self.alias_title in item:
            value = item[self.alias_title]
            item["title"] = value["title"] if isinstance(value, dict) else f"{value}"
        return item

    def _get_schema_fields(self) -> tuple[tuple[str,], ...]:
        value_type = self.field.value_type
        schema = value_type.schema
        fields = tuple(
            (field_name, field_type.bind(self.context))
            for field_name, field_type in getFields(schema).items()
        )
        return fields

    def __call__(self) -> list[dict]:
        raw_value = self.get_value()
        response = []
        for item in raw_value:
            response.append(self._serialize_row_item(item))
        return json_compatible(response)
