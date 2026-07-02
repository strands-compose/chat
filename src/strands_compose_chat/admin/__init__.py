"""Admin panel: sqladmin views and authentication backend.

Importing this package applies the sqladmin/wtforms compatibility shim (see
``compat``) so boolean form fields render under wtforms 3.2 before any admin
view is constructed.
"""

from .compat import apply_wtforms_compat

apply_wtforms_compat()
