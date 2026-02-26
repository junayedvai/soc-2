from __future__ import annotations

import re
from datetime import datetime, timezone
from typing import Tuple, Optional

from app.models import ParsedEvent, Severity

FAILED = re.compile(r"Failed password for (?P<user>\S+) from (?P<ip>[\d\.]+)")
ACCEPTED = re.compile(r"Accepted (?:password|publickey) for (?P<user>\S+) from (?P<ip>[\d\.]+)")
SUDO = re.compile(r"sudo:\s+(?P<user>\S+) :")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def categorize_line(line: str) -> Optional[Tuple[str, Severity, dict]]:
    line_l = line.lower()

    m = FAILED.search(line)
    if m:
        return (
            "Failed Login",
            "Medium",
            {"user": m.group("user"), "ip": m.group("ip"), "message": "Authentication failed."},
        )

    m = ACCEPTED.search(line)
    if m:
        # successful login after failures can be high
        return (
            "Suspicious Login",
            "High",
            {"user": m.group("user"), "ip": m.group("ip"), "message": "Successful login detected."},
        )

    if "brute" in line_l or "too many" in line_l:
        return ("Brute Force", "High", {"message": "Brute force indicator."})

    if "privilege" in line_l or "escalation" in line_l:
        return ("Privilege Escalation", "High", {"message": "Privilege escalation signal."})

    if SUDO.search(line):
        m2 = SUDO.search(line)
        return (
            "Privilege Escalation",
            "High",
            {"user": m2.group("user"), "message": "sudo activity observed."},
        )

    if "sql" in line_l and ("injection" in line_l or "sqli" in line_l):
        return ("Web Attack", "High", {"message": "Potential SQL injection attempt."})

    return None


def parse_logs(raw: str) -> list[ParsedEvent]:
    events: list[ParsedEvent] = []
    fail_count = 0
    last_fail_user = None
    last_fail_ip = None

    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue

        cat = categorize_line(line)
        if not cat:
            continue

        category, severity, meta = cat
        user = meta.get("user")
        ip = meta.get("ip")

        if category == "Failed Login":
            fail_count += 1
            last_fail_user = user
            last_fail_ip = ip

        # boost to critical if brute-force pattern present
        if fail_count >= 5 and category in ("Failed Login", "Suspicious Login"):
            severity = "Critical"
            category = "Brute Force"
            meta["message"] = "Repeated failed logins indicate brute force."  # type: ignore

        events.append(
            ParsedEvent(
                ts=now_iso(),
                category=category,
                severity=severity,
                message=meta.get("message", ""),
                user=user,
                ip=ip,
            )
        )

    # If we saw a successful login after failures, bump severity
    if fail_count >= 3:
        for e in events:
            if e.category == "Suspicious Login" and e.user == last_fail_user and e.ip == last_fail_ip:
                e.severity = "Critical"  # type: ignore
                e.message = "Successful auth after repeated failures (potential compromise)."  # type: ignore

    return events


def ai_explain(events: list[ParsedEvent]) -> str:
    if not events:
        return "No security-relevant patterns detected in provided logs."

    sev_rank = {"Low": 0, "Medium": 1, "High": 2, "Critical": 3}
    max_sev = max(events, key=lambda e: sev_rank[e.severity]).severity
    cats = sorted(set(e.category for e in events))

    recs = []
    if any(e.category in ("Brute Force", "Failed Login") for e in events):
        recs.append("Block offending IPs, enforce MFA, and review account lockout policies")
    if any(e.category in ("Privilege Escalation",) for e in events):
        recs.append("Validate sudo/privileged actions and review least-privilege posture")
    if any(e.category in ("Web Attack",) for e in events):
        recs.append("Apply WAF rules, patch vulnerable endpoints, and review app logs")

    rec = "; ".join(recs) if recs else "Validate context and tune detections to reduce noise"

    return (
        f"Detected categories: {', '.join(cats)}. Maximum observed severity: {max_sev}. "
        f"Recommended actions: {rec}."
    )
