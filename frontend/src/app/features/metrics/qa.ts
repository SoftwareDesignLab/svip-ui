export default {
  "fileName": "ExampleQA",
  "components": {
    "metadata": {
      "uid": [
        {
          "attribute": ["CompletenessProcessor"],
          "test": "IsEmptyOrNull",
          "message": "SBOM has a uid",
          "details": "uid: 'my-uid'",
          "pass": 1
        },
        {
          "attribute": ["CDXProcessor"],
          "test": "IsValidUID",
          "message": "SBOM has an invalid Serial Number",
          "details": "'my-uid' is an invalid serial number",
          "pass": 0
        }
      ],
      "licenses": [
        {
          "attribute": ["CompletenessProcessor"],
          "test": "IsEmptyOrNull",
          "message": "SBOM has Licenses",
          "details": "SBOM has 2 licenses: 'MIT', 'Foobar'",
          "pass": 1
        },
        {
          "attribute": ["LicenseProcessor"],
          "test": "IsValidLicense",
          "message": "SBOM has an valid license",
          "details": "'MIT' is a valid license",
          "pass": 1
        },
        {
          "attribute": ["LicenseProcessor"],
          "test": "IsValidLicense",
          "message": "SBOM has an invalid license",
          "details": "'Foobar' is an invalid license",
          "pass": 0
        }
      ]
    },
    "numpy": {
      "version": [
        {
          "attribute": ["CompletenessProcessor"],
          "test": "IsEmptyOrNull",
          "message": "Component has a version",
          "details": "version: 1.3.2",
          "pass": 1
        }
      ],
      "cpes": [
        {
          "attribute": ["CompletenessProcessor"],
          "test": "IsEmptyOrNull",
          "message": "Component has CPEs",
          "details": "Component has 1 CPE: 'my-cpe'",
          "pass": 1
        },
        {
          "attribute": ["AccuracyProcessor"],
          "test": "IsValidCPE",
          "message": "Component has an invalid CPE",
          "details": "'my-cpe' is an invalid CPE",
          "pass": 1
        }
      ]
    }
  }
}