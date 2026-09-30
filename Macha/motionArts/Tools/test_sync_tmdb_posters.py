"""Offline regression checks; all note writes stay in a temporary directory."""

from pathlib import Path
import tempfile
import unittest

import sync_tmdb_posters as sync


class ExistingMetadataTests(unittest.TestCase):
    def test_populated_yaml_styles_are_preserved(self):
        examples = [
            "genres: [Drama]",
            'genres: ["Drama", "Science Fiction"] # personal choices',
            'genres: ["C#", "Drama"]',
            "genres:\n  - Drama",
            "genres:\n- Drama",
            "genres: # curated\n    - Drama",
            "genres:\n  # curated\n\n  - Drama",
            "genres: [\n  Drama,\n  Comedy\n]",
            "genres: *curated_genres",
            "genres: Drama",  # Preserve unexpected nonempty types too.
        ]
        for frontmatter in examples:
            with self.subTest(frontmatter=frontmatter):
                self.assertTrue(sync.has_list_field(frontmatter, "genres"))

    def test_missing_and_empty_values_allow_enrichment(self):
        examples = [
            "tags:\n  - movie",
            "genres:",
            "genres: # empty\ntags:\n  - movie",
            "genres: []",
            "genres: [ ] # empty",
            "genres: null # empty",
            "genres: ~",
            'genres: ""',
            "genres: ''",
        ]
        for frontmatter in examples:
            with self.subTest(frontmatter=frontmatter):
                self.assertFalse(sync.has_list_field(frontmatter, "genres"))

    def test_another_fields_list_does_not_count(self):
        self.assertFalse(sync.has_list_field("genres:\ntags:\n- movie", "genres"))
        self.assertFalse(sync.has_list_field("genres:\n'other':\n- Drama", "genres"))

    def test_update_preserves_values_and_body_without_force(self):
        original = (
            "---\ngenres: [Personal Choice]\ndirectors:\n- My Director\n"
            "cast: # curated\n    - My Actor\ntags:\n  - movie\n---\n"
            "# My note\nKeep this body.\n"
        )
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "note.md"
            path.write_text(original)
            sync.update_note(path, {
                "genres": ["Drama"], "directors": ["Other Director"],
                "cast": ["Other Actor"],
            })
            self.assertEqual(path.read_text(), original)

    def test_empty_list_is_filled_without_changing_other_fields(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "note.md"
            path.write_text("---\ngenres: [] # empty\ntags:\n- movie\n---\nBody\n")
            sync.update_note(path, {"genres": ["Drama"]})
            self.assertEqual(path.read_text(),
                             '---\ngenres:\n  - "Drama"\ntags:\n- movie\n---\nBody\n')

    def test_force_replaces_inline_and_indentless_lists(self):
        for value in ("genres: [Old]", "genres:\n- Old"):
            with self.subTest(value=value), tempfile.TemporaryDirectory() as folder:
                path = Path(folder) / "note.md"
                path.write_text(f"---\n{value}\ntags:\n- movie\n---\nBody\n")
                sync.update_note(path, {"genres": ["Drama"]}, force=True)
                self.assertEqual(path.read_text(),
                                 '---\ngenres:\n  - "Drama"\ntags:\n- movie\n---\nBody\n')


if __name__ == "__main__":
    unittest.main()
