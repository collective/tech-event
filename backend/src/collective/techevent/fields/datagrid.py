from zope import schema
from zope.interface import implementer
from zope.schema._bootstrapfields import _NotGiven
from zope.schema.interfaces import IList


class IDataGrid(IList):
    """Field containing a value that implements the API of a conventional
    Python list."""


@implementer(IDataGrid)
class DataGrid(schema.List):
    """A field representing a DataGrid ."""

    alias_id: str = "id"
    alias_title: str = ""

    def __init__(self, alias_id: str = _NotGiven, alias_title: str = _NotGiven, **kw):
        super().__init__(**kw)
        if alias_id is not _NotGiven:
            self.alias_id = alias_id
        if alias_title is not _NotGiven:
            self.alias_title = alias_title
