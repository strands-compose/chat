# https://just.systems/man/en/

# SETTINGS

set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

# VARIABLES

PACKAGE    := "strands-compose-chat"
SOURCES    := "src/strands_compose_chat"
TESTS      := "tests"

# DEFAULTS

# display help information
default:
    @just --list

# IMPORTS

import 'tasks/check.just'
import 'tasks/clean.just'
import 'tasks/commit.just'
import 'tasks/db.just'
import 'tasks/format.just'
import 'tasks/install.just'
import 'tasks/release.just'
import 'tasks/test.just'
import 'tasks/ui.just'
