#!/usr/bin/env python3
"""Fill Movie Album note frontmatter with TMDB poster, genres, and directors.

Reads TMDB_BEARER_TOKEN or TMDB_API_KEY from the environment.
If the short API key is accidentally assigned to TMDB_BEARER_TOKEN, it is
used as an API key instead of failing bearer authentication.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
import re
import sys
import time
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[3]
ITEMS_DIR = ROOT / "mmacha" / "motionArts" / "Items"
PLUGIN_DATA = ROOT / ".obsidian" / "plugins" / "mmacha-auto" / "data.json"
API_BASE = "https://api.themoviedb.org/3"
IMAGE_BASE = "https://image.tmdb.org/t/p/w500"

LANGUAGE_INDUSTRY = {
    "en": "Hollywood",
    "hi": "Bollywood",
    "te": "Tollywood",
    "ta": "Kollywood",
    "ml": "Mollywood",
    "kn": "Sandalwood",
    "mr": "Marathi cinema",
    "ja": "Japanese cinema",
    "ko": "Korean cinema",
    "fr": "French cinema",
    "de": "German cinema",
    "it": "Italian cinema",
    "es": "Spanish-language cinema",
    "no": "Norwegian cinema",
    "ru": "Russian cinema",
}

QUERY_OVERRIDES = {
    "8½": "8½",
    "21 Jump Street": "21 Jump Street",
    "Birdman": "Birdman or (The Unexpected Virtue of Ignorance)",
    "Birdman or (The Unexpected Virtue of Ignorance)": "Birdman or (The Unexpected Virtue of Ignorance)",
    "Dark": "Dark",
    "Dark Knight": "The Dark Knight",
    "Harakiri": "Harakiri",
    "House": "House",
    "Inglourious Basterds": "Inglourious Basterds",
    "K": "K",
    "King Arthur": "King Arthur: Legend of the Sword",
    "King Arthur: Legend of the Sword": "King Arthur: Legend of the Sword",
    "Lord of the rings": "The Lord of the Rings: The Fellowship of the Ring",
    "LOTR": "The Lord of the Rings: The Return of the King",
    "The Lord of the Rings: The Fellowship of the Ring": "The Lord of the Rings: The Fellowship of the Ring",
    "The Lord of the Rings: The Two Towers": "The Lord of the Rings: The Two Towers",
    "The Lord of the Rings: The Return of the King": "The Lord of the Rings: The Return of the King",
    "The Hobbit: An Unexpected Journey": "The Hobbit: An Unexpected Journey",
    "The Hobbit: The Desolation of Smaug": "The Hobbit: The Desolation of Smaug",
    "The Hobbit: The Battle of the Five Armies": "The Hobbit: The Battle of the Five Armies",
    "The Lord of the Rings: The War of the Rohirrim": "The Lord of the Rings: The War of the Rohirrim",
    "The Magnificent Seven": "The Magnificent Seven",
    "Pride and Prejudice": "Pride & Prejudice",
    "Shiva": "Shiva",
    "The Accountant": "The Accountant",
    "The Boys": "The Boys",
    "The Human Condition": "The Human Condition I: No Greater Love",
    "The Dark Knight": "The Dark Knight",
    "The Return": "The Return 2003",
    "Warrior": "Warrior",
    "Steins Gate": "Steins;Gate",
    "Deca-dance": "Deca-Dence",
    "Osamu: Ranking of kings": "Ranking of Kings",
    "Boogie Pop and Others": "Boogiepop and Others",
    "Summer time rendering": "Summer Time Rendering",
    "Megalo box": "MEGALOBOX",
    "K project": "K",
    "Orb": "Orb: On the Movements of the Earth",
    "ACCA-13": "ACCA: 13-Territory Inspection Dept.",
    "Nura: rise of yokai clan": "Nura: Rise of the Yokai Clan",
    "Atlantis the Lost empire": "Atlantis: The Lost Empire",
    "Boogiepop and Others": "Boogiepop and Others",
    "Brooklyn": "Brooklyn",
    "The Princess and Frog": "The Princess and the Frog",
    "My neighbour Totoro": "My Neighbor Totoro",
    "Moana": "Moana",
    "Up": "Up",
    "Wild Robot": "The Wild Robot",
    "Monster inc.": "Monsters, Inc.",
    "The World's End": "The World's End",
    "Tim Burton's  The nightmare before christmas": "The Nightmare Before Christmas",
    "ghost in the shell": "Ghost in the Shell",
    "Boy and the Heron": "The Boy and the Heron",
}

YEAR_OVERRIDES = {
    "8½": "1963",
    "21 Jump Street": "2012",
    "Birdman": "2014",
    "Birdman or (The Unexpected Virtue of Ignorance)": "2014",
    "Dark Knight": "2008",
    "The Dark Knight": "2008",
    "The Lord of the Rings: The Fellowship of the Ring": "2001",
    "The Lord of the Rings: The Two Towers": "2002",
    "The Lord of the Rings: The Return of the King": "2003",
    "The Hobbit: An Unexpected Journey": "2012",
    "The Hobbit: The Desolation of Smaug": "2013",
    "The Hobbit: The Battle of the Five Armies": "2014",
    "The Lord of the Rings: The War of the Rohirrim": "2024",
    "Moana": "2016",
    "Up": "2009",
    "The World's End": "2013",
    "Boogiepop and Others": "2019",
    "Brooklyn": "2015",
    "Harakiri": "1962",
    "K": "2012",
    "King Arthur": "2017",
    "King Arthur: Legend of the Sword": "2017",
    "Pride and Prejudice": "2005",
    "Shiva": "1989",
    "The Accountant": "2016",
    "The Magnificent Seven": "1960",
    "Warrior": "2011",
}

IMDB_OVERRIDES = {
    "8½": "tt0056801",
    "The Lord of the Rings: The Fellowship of the Ring": "tt0120737",
    "The Lord of the Rings: The Two Towers": "tt0167261",
    "The Lord of the Rings: The Return of the King": "tt0167260",
    "The Hobbit: An Unexpected Journey": "tt0903624",
    "The Hobbit: The Desolation of Smaug": "tt1170358",
    "The Hobbit: The Battle of the Five Armies": "tt2310332",
    "Birdman": "tt2562232",
    "Birdman or (The Unexpected Virtue of Ignorance)": "tt2562232",
    "King Arthur": "tt1972591",
    "King Arthur: Legend of the Sword": "tt1972591",
    "Dark Knight": "tt0468569",
    "The Dark Knight": "tt0468569",
    "Moana": "tt3521164",
    "Up": "tt1049413",
    "The World's End": "tt1213663",
}


def looks_like_bearer_token(value: str | None) -> bool:
    if not value:
        return False
    return value.startswith("eyJ") and value.count(".") == 2


def api_auth() -> tuple[str | None, str | None]:
    bearer_env = os.environ.get("TMDB_BEARER_TOKEN")
    api_key_env = os.environ.get("TMDB_API_KEY")

    if looks_like_bearer_token(bearer_env):
        return bearer_env, api_key_env
    if api_key_env:
        return None, api_key_env
    if bearer_env:
        return None, bearer_env
    if PLUGIN_DATA.exists():
        with PLUGIN_DATA.open(encoding="utf-8") as handle:
            plugin_token = (json.load(handle).get("tmdbBearerToken") or "").strip()
        if looks_like_bearer_token(plugin_token):
            return plugin_token, None
        if plugin_token:
            return None, plugin_token

    bearer = None
    api_key = None
    return bearer, api_key


def api_get(path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
    bearer, api_key = api_auth()
    params = dict(params or {})
    headers = {"Accept": "application/json", "User-Agent": "obsidian-movie-album/1.0"}
    if bearer:
        headers["Authorization"] = f"Bearer {bearer}"
    elif api_key:
        params["api_key"] = api_key
    else:
        raise RuntimeError("Set TMDB_BEARER_TOKEN or TMDB_API_KEY before running.")

    url = f"{API_BASE}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    request = Request(url, headers=headers)
    for attempt in range(5):
        try:
            with urlopen(request, timeout=30) as response:
                return json.loads(response.read().decode("utf-8"))
        except HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504) or attempt == 4:
                raise
            time.sleep(1.5 * (attempt + 1))
        except (ConnectionResetError, TimeoutError, URLError) as exc:
            if attempt == 4:
                raise
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("unreachable retry state")


def parse_frontmatter(text: str) -> tuple[str, str]:
    match = re.match(r"^---\n(.*?)\n---\n?", text, flags=re.S)
    if not match:
        raise ValueError("note has no YAML frontmatter")
    return match.group(1), text[match.end() :]


def yaml_unquote(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] == '"':
        return value[1:-1].replace('\\"', '"').replace("\\\\", "\\")
    return value


def read_scalar(frontmatter: str, key: str) -> str:
    prefix = f"{key}:"
    for line in frontmatter.splitlines():
        if line.startswith(prefix):
            return yaml_unquote(line[len(prefix) :])
    return ""


def yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def yaml_scalar(value: Any) -> str:
    if value is None or value == "":
        return ""
    if isinstance(value, (int, float)):
        return str(value)
    return yaml_string(str(value))


def field_block(key: str, value: Any) -> list[str]:
    if isinstance(value, list):
        if not value:
            return [f"{key}: []"]
        return [f"{key}:"] + [f"  - {yaml_string(str(item))}" for item in value]
    return [f"{key}: {yaml_scalar(value)}"]


def set_field(frontmatter: str, key: str, value: Any) -> str:
    lines = frontmatter.splitlines()
    start = None
    for index, line in enumerate(lines):
        if re.match(rf"^{re.escape(key)}\s*:", line):
            start = index
            break

    replacement = field_block(key, value)
    if start is None:
        insert_at = next(
            (i for i, line in enumerate(lines) if line.startswith("source_note:") or line.startswith("tags:")),
            len(lines),
        )
        lines[insert_at:insert_at] = replacement
        return "\n".join(lines)

    end = start + 1
    while end < len(lines):
        line = lines[end]
        if line and not line.startswith(" ") and re.match(r"^[A-Za-z0-9_.-]+\s*:", line):
            break
        end += 1
    lines[start:end] = replacement
    return "\n".join(lines)


def find_by_imdb_id(title: str, media_type: str) -> dict[str, Any] | None:
    imdb_id = IMDB_OVERRIDES.get(title)
    if not imdb_id:
        return None
    payload = api_get(f"/find/{imdb_id}", {"external_source": "imdb_id"})
    key = "tv_results" if media_type in ("series", "anime") else "movie_results"
    results = payload.get(key) or []
    return results[0] if results else None


def search_title(title: str, media_type: str) -> dict[str, Any] | None:
    exact_result = find_by_imdb_id(title, media_type)
    if exact_result:
        return exact_result

    path = "/search/tv" if media_type in ("series", "anime") else "/search/movie"
    queries = [QUERY_OVERRIDES.get(title, title), title]
    if title == "K":
        queries.extend(["K Project", "K"])
    seen = set()
    all_results: list[dict[str, Any]] = []
    for query in queries:
        if query in seen:
            continue
        seen.add(query)
        params = {
            "query": query,
            "include_adult": "false",
            "language": "en-US",
            "page": 1,
        }
        year = YEAR_OVERRIDES.get(title)
        if year and media_type in ("series", "anime"):
            params["first_air_date_year"] = year
        elif year:
            params["year"] = year
            params["primary_release_year"] = year
        payload = api_get(
            path,
            params,
        )
        results = payload.get("results") or []
        all_results.extend(results)
    return choose_best_result(title, media_type, all_results)


def normalized_title(value: str | None) -> str:
    value = value or ""
    value = value.lower().replace("&", "and")
    value = re.sub(r"[^a-z0-9]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def result_title(result: dict[str, Any], media_type: str) -> str:
    if media_type in ("series", "anime"):
        return result.get("name") or result.get("original_name") or ""
    return result.get("title") or result.get("original_title") or ""


def result_year(result: dict[str, Any], media_type: str) -> str:
    key = "first_air_date" if media_type in ("series", "anime") else "release_date"
    value = result.get(key) or ""
    return value[:4] if re.match(r"^\d{4}", value) else ""


def choose_best_result(title: str, media_type: str, results: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not results:
        return None
    wanted_title = normalized_title(QUERY_OVERRIDES.get(title, title))
    wanted_year = YEAR_OVERRIDES.get(title)

    def score(result: dict[str, Any]) -> tuple[int, float]:
        candidate = normalized_title(result_title(result, media_type))
        candidate_year = result_year(result, media_type)
        points = 0
        if candidate == wanted_title:
            points += 80
        elif wanted_title and (candidate.startswith(wanted_title) or wanted_title in candidate.split()):
            points += 25
        if wanted_year and candidate_year == wanted_year:
            points += 50
        elif wanted_year:
            points -= 20
        if result.get("poster_path"):
            points += 5
        points += int(float(result.get("vote_count") or 0) > 50) * 5
        return points, float(result.get("popularity") or 0)

    best = max(results, key=score)
    return best if score(best)[0] > 0 else None


def load_genres(media_type: str) -> dict[int, str]:
    path = "/genre/tv/list" if media_type in ("series", "anime") else "/genre/movie/list"
    payload = api_get(path, {"language": "en"})
    return {item["id"]: item["name"] for item in payload.get("genres", [])}


def year_from(result: dict[str, Any], media_type: str) -> str:
    key = "first_air_date" if media_type in ("series", "anime") else "release_date"
    value = result.get(key) or ""
    return value[:4] if re.match(r"^\d{4}", value) else ""


def load_directors(result: dict[str, Any], media_type: str) -> list[str]:
    if media_type not in ("movie", "anime-movie"):
        return []
    tmdb_id = result.get("id")
    if not tmdb_id:
        return []
    payload = api_get(f"/movie/{tmdb_id}/credits", {"language": "en-US"})
    directors: list[str] = []
    seen: set[str] = set()
    for person in payload.get("crew", []):
        if person.get("job") != "Director":
            continue
        name = person.get("name")
        if name and name not in seen:
            directors.append(name)
            seen.add(name)
    return directors


def metadata_from(result: dict[str, Any], media_type: str, genres: dict[int, str]) -> dict[str, Any]:
    poster_path = result.get("poster_path")
    genre_names = [genres[item] for item in result.get("genre_ids", []) if item in genres]
    return {
        "poster": f"{IMAGE_BASE}{poster_path}" if poster_path else "",
        "industry": industry_from(result, media_type),
        "genres": genre_names,
        "directors": load_directors(result, media_type),
    }


def industry_from(result: dict[str, Any], media_type: str) -> str:
    if media_type in ("anime", "anime-movie"):
        return "Anime"
    language = result.get("original_language")
    if language in LANGUAGE_INDUSTRY:
        return LANGUAGE_INDUSTRY[language]
    countries = result.get("origin_country") or []
    if countries and countries[0] == "IN":
        return "Indian cinema"
    return ""


def update_note(path: Path, metadata: dict[str, Any]) -> None:
    text = path.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(text)
    for key, value in metadata.items():
        if value not in ("", [], None):
            frontmatter = set_field(frontmatter, key, value)
    path.write_text(f"---\n{frontmatter}\n---\n{body}", encoding="utf-8")


def has_real_poster(frontmatter: str) -> bool:
    poster = read_scalar(frontmatter, "poster")
    return poster.startswith("http://") or poster.startswith("https://") or poster.startswith("[[")


def has_list_field(frontmatter: str, key: str) -> bool:
    lines = frontmatter.splitlines()
    for index, line in enumerate(lines):
        if re.match(rf"^{re.escape(key)}\s*:\s*\[\]\s*$", line):
            return False
        if not re.match(rf"^{re.escape(key)}\s*:\s*$", line):
            continue
        for item in lines[index + 1 :]:
            if item and not item.startswith(" ") and re.match(r"^[A-Za-z0-9_.-]+\s*:", item):
                return False
            if item.startswith("  - "):
                return True
        return False
    return False


def has_genres(frontmatter: str) -> bool:
    if re.search(r"^genres:\s*\[\]\s*$", frontmatter, flags=re.M):
        return False
    return has_list_field(frontmatter, "genres")


def has_directors(frontmatter: str) -> bool:
    return has_list_field(frontmatter, "directors")


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync Movie Album posters from TMDB.")
    parser.add_argument("--dry-run", action="store_true", help="show matches without editing notes")
    parser.add_argument("--force", action="store_true", help="refresh notes even when poster and genres already exist")
    parser.add_argument("--limit", type=int, default=0, help="limit number of notes processed")
    parser.add_argument("--media-type", action="append", default=[], help="only process matching media_type values")
    parser.add_argument("--only", action="append", default=[], help="only process an exact title or note name")
    parser.add_argument("--sleep", type=float, default=0.6, help="delay between search requests")
    args = parser.parse_args()

    if not ITEMS_DIR.exists():
        print(f"Missing items folder: {ITEMS_DIR}", file=sys.stderr)
        return 1

    genre_cache: dict[str, dict[int, str]] = {}
    updated = 0
    skipped = 0
    notes = sorted(ITEMS_DIR.glob("*.md"))
    if args.limit:
        notes = notes[: args.limit]

    for note in notes:
        try:
            frontmatter, _ = parse_frontmatter(note.read_text(encoding="utf-8"))
            title = read_scalar(frontmatter, "title") or note.stem
            media_type = read_scalar(frontmatter, "media_type") or "movie"
            if args.media_type and media_type not in args.media_type:
                continue
            if args.only and title not in args.only and note.stem not in args.only:
                continue
            needs_directors = media_type in ("movie", "anime-movie")
            has_required_directors = not needs_directors or has_directors(frontmatter)
            if not args.force and has_real_poster(frontmatter) and has_genres(frontmatter) and has_required_directors:
                continue
            result = search_title(title, media_type)
            time.sleep(args.sleep)
            if not result:
                print(f"MISS  {title}")
                skipped += 1
                continue
            if media_type not in genre_cache:
                genre_cache[media_type] = load_genres(media_type)
            metadata = metadata_from(result, media_type, genre_cache[media_type])
            matched_title = result.get("name") if media_type in ("series", "anime") else result.get("title")
            poster_flag = "poster" if metadata.get("poster") else "no poster"
            genre_flag = ", ".join(metadata.get("genres") or []) or "no genres"
            director_flag = ", ".join(metadata.get("directors") or []) or "no directors"
            print(f"MATCH {title} -> {matched_title} ({poster_flag}; {genre_flag}; {director_flag})")
            if not args.dry_run:
                update_note(note, metadata)
                updated += 1
        except Exception as exc:
            print(f"ERROR {note.name}: {exc}", file=sys.stderr)
            skipped += 1

    action = "would update" if args.dry_run else "updated"
    print(f"{action}: {updated if not args.dry_run else len(notes) - skipped}; skipped: {skipped}")
    return 0 if skipped == 0 else 2


if __name__ == "__main__":
    raise SystemExit(main())
