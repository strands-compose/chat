"""Compatibility shim for sqladmin widgets against supported wtforms versions.

sqladmin's ``BooleanInputWidget`` subclasses wtforms' base ``Input`` widget
without declaring ``validation_attrs``. wtforms 3.1 defined that attribute on the
base ``Input`` class, so the widget inherited it; wtforms 3.2 moved
``validation_attrs`` onto each concrete widget subclass, leaving
``BooleanInputWidget`` without it. Rendering any boolean form field then raises
``AttributeError`` inside ``Input.__call__``.

This shim gives the widget the checkbox validation attributes it should have had,
restoring boolean-field rendering under wtforms 3.2 without waiting on an sqladmin
release. It is a no-op on wtforms 3.1, where the attribute is already inherited.
"""

from sqladmin.widgets import BooleanInputWidget
from wtforms.widgets import CheckboxInput


def apply_wtforms_compat() -> None:
    """Ensure sqladmin's ``BooleanInputWidget`` declares ``validation_attrs``.

    Idempotent: only assigns when the attribute is missing, so it is safe to call
    once during app construction and does nothing on wtforms versions that already
    provide it via the base ``Input`` widget.
    """
    if not hasattr(BooleanInputWidget, "validation_attrs"):
        setattr(BooleanInputWidget, "validation_attrs", list(CheckboxInput.validation_attrs))
