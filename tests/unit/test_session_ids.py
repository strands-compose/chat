"""Tests for ``sessions.ids``: user suffix sanitizing and session id minting."""

import re

import pytest

from strands_compose_chat.sessions.ids import new_session_id, user_session_suffix
from tests.factories import make_user


@pytest.mark.parametrize(
    ("email", "username", "expected"),
    [
        ("john.doe@gmail.com", "jdoe", "JOHN-DOE-GMAIL-COM"),
        ("", "Michal$ Nowak", "MICHAL-NOWAK"),
        ("", "Michał  Żółć", "MICHAL-ZOLC"),
        ("", "  --a__b--  ", "A-B"),
        ("", "$$$", ""),
        ("a" * 200 + "@x.com", "u", "A" * 64),
    ],
)
def test_user_session_suffix(email: str, username: str, expected: str) -> None:
    user = make_user(email=email, username=username)
    assert user_session_suffix(user) == expected


def test_new_session_id_has_uuid_and_suffix() -> None:
    session_id = new_session_id(make_user(email="john.doe@gmail.com"))
    assert re.fullmatch(r"[0-9a-f-]{36}_JOHN-DOE-GMAIL-COM", session_id)
    assert 33 <= len(session_id) <= 256


def test_new_session_id_without_suffix_is_bare_uuid() -> None:
    session_id = new_session_id(make_user(email="", username="$$$"))
    assert re.fullmatch(r"[0-9a-f-]{36}", session_id)
