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

    def __init__(
        self,
        alias_id: str | type[_NotGiven] = _NotGiven,
        alias_title: str | type[_NotGiven] = _NotGiven,
        **kw: object,
    ) -> None:
        """Create the DataGrid field.

        :param alias_id: Name of the column used as id, if given.
        :param alias_title: Name of the column used as title, if given.
        :param kw: Keyword arguments passed to the List field.
        """
        super().__init__(**kw)  # type: ignore[arg-type]  # schema.List keyword arguments are heterogeneous
        if alias_id is not _NotGiven:
            self.alias_id = alias_id  # type: ignore[assignment]  # _NotGiven is a sentinel class, excluded by the check above
        if alias_title is not _NotGiven:
            self.alias_title = alias_title  # type: ignore[assignment]  # _NotGiven is a sentinel class, excluded by the check above
