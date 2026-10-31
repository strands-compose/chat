"""Tests for ``sessions.ids``: user suffix sanitizing, session id minting and anonymising."""

import re

import pytest

from strands_compose_chat.sessions.ids import (
    anonymized_session_id,
    new_session_id,
    user_session_suffix,
)
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


_UUID = "0f8fad5b-d9cb-469f-a165-70867728950e"


@pytest.mark.parametrize(
    "session_id",
    [f"{_UUID}_JOHN-DOE-GMAIL-COM", _UUID, f"{_UUID}_ANONYMIZED"],
    ids=["with-suffix", "bare-uuid", "already-anonymized"],
)
def test_anonymized_session_id_keeps_uuid_and_drops_suffix(session_id: str) -> None:
    assert anonymized_session_id(session_id) == f"{_UUID}_ANONYMIZED"


@pytest.mark.parametrize(
    "session_id",
    ["sess_" + "a" * 59, f"{_UUID}JOHN", None],
    ids=["client-supplied", "uuid-without-separator", "none"],
)
def test_anonymized_session_id_mints_fresh_uuid_without_leading_uuid(
    session_id: str | None,
) -> None:
    result = anonymized_session_id(session_id)
    assert re.fullmatch(r"[0-9a-f-]{36}_ANONYMIZED", result)
    assert not result.startswith(_UUID)
