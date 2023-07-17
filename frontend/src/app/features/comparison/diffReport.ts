export default {
  "target": "sbomID1",
  "diffReport": {
    "sbomID2": {
      "componentConflicts": {
        "metadata": [
          {
            "type": "COMPONENT_LICENSE_MISMATCH",
            "target": null,
            "other": "LGPL-2.1-only"
          },
          {
            "type": "COMPONENT_LICENSE_MISMATCH",
            "target": "LGPL-2.1-only",
            "other": null
          }
        ],
        "python": [
          {
            "type": "COMPONENT_VERSION_MISMATCH",
            "target": "3.11.2",
            "other": null
          },
          {
            "type": "COMPONENT_SPDXID_MISMATCH",
            "target": "pkg:generic/python3.11.2?package-id=4224a04547db804b",
            "other": "b5f6963006b78111"
          },
          {
            "type": "COMPONENT_VERSION_MISMATCH",
            "target": "3.11.2",
            "other": "3.9.2"
          }
        ]
      },
      "missingComponents": [
        "numpy",
        "pandas"
      ]
    }
  }
}
