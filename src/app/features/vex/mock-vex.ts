export default {
  "vex": {
    "vexIdentifier": null,
    "originType": "CSAF",
    "specVersion": "2.0",
    "docVersion": "1.0",
    "timeFirstIssued": "2023-07-25T11:38:34.183508200",
    "timeLastUpdated": "2023-07-25T11:38:34.183508200",
    "vexstatements": [
      {
        "statementID": "GHSA-7g45-4rm6-3mm3",
        "statementVersion": "1.0",
        "statementFirstIssued": "2023-06-14T18:30:38Z",
        "statementLastUpdated": "2023-06-30T20:25:28.411126Z",
        "status": {
          "vulnStatus": "AFFECTED",
          "justification": "NOT_APPLICABLE",
          "actionStatement": "Use of Java's default temporary directory for file creation in `FileBackedOutputStream` in Google Guava versions 1.0 to 31.1 on Unix systems and Android Ice Cream Sandwich allows other users and apps on the machine with access to the default Java temporary directory to be able to access the files created by the class.\\n\\nEven though the security vulnerability is fixed in version 32.0.0, maintainers recommend using version 32.0.1 as version 32.0.0 breaks some functionality under Windows.\\n\\n",
          "impactStatement": "Use of Java's default temporary directory for file creation in `FileBackedOutputStream` in Google Guava versions 1.0 to 31.1 on Unix systems and Android Ice Cream Sandwich allows other users and apps on the machine with access to the default Java temporary directory to be able to access the files created by the class.\\n\\nEven though the security vulnerability is fixed in version 32.0.0, maintainers recommend using version 32.0.1 as version 32.0.0 breaks some functionality under Windows.\\n\\n"
        },
        "products": [
          {
            "productID": "com.google.guava:guava:Maven:19.0",
            "supplier": ""
          }
        ],
        "vulnerability": {
          "statementID": "CVE-2023-2976",
          "description": "Guava vulnerable to insecure use of temporary directory"
        }
      },
      {
        "statementID": "GHSA-mvr2-9pj6-7w5j",
        "statementVersion": "1.0",
        "statementFirstIssued": "2020-06-15T20:35:11Z",
        "statementLastUpdated": "2023-04-11T01:46:16.610508Z",
        "status": {
          "vulnStatus": "AFFECTED",
          "justification": "NOT_APPLICABLE",
          "actionStatement": "Unbounded memory allocation in Google Guava 11.0 through 24.x before 24.1.1 allows remote attackers to conduct denial of service attacks against servers that depend on this library and deserialize attacker-provided data, because the AtomicDoubleArray class (when serialized with Java serialization) and the CompoundOrdering class (when serialized with GWT serialization) perform eager allocation without appropriate checks on what a client has sent and whether the data size is reasonable.",
          "impactStatement": "Unbounded memory allocation in Google Guava 11.0 through 24.x before 24.1.1 allows remote attackers to conduct denial of service attacks against servers that depend on this library and deserialize attacker-provided data, because the AtomicDoubleArray class (when serialized with Java serialization) and the CompoundOrdering class (when serialized with GWT serialization) perform eager allocation without appropriate checks on what a client has sent and whether the data size is reasonable."
        },
        "products": [
          {
            "productID": "com.google.guava:guava:Maven:19.0",
            "supplier": ""
          }
        ],
        "vulnerability": {
          "statementID": "CVE-2018-10237",
          "description": "Denial of Service in Google Guava"
        }
      },
      {
        "statementID": "GHSA-5mg8-w23w-74h3",
        "statementVersion": "1.0",
        "statementFirstIssued": "2021-03-25T17:04:19Z",
        "statementLastUpdated": "2023-06-06T19:03:04.529255Z",
        "status": {
          "vulnStatus": "AFFECTED",
          "justification": "NOT_APPLICABLE",
          "actionStatement": "A temp directory creation vulnerability exists in all Guava versions allowing an attacker with access to the machine to potentially access data in a temporary directory created by the Guava `com.google.common.io.Files.createTempDir()`. The permissions granted to the directory created default to the standard unix-like /tmp ones, leaving the files open. We recommend explicitly changing the permissions after the creation of the directory, or removing uses of the vulnerable method\\n",
          "impactStatement": "A temp directory creation vulnerability exists in all Guava versions allowing an attacker with access to the machine to potentially access data in a temporary directory created by the Guava `com.google.common.io.Files.createTempDir()`. The permissions granted to the directory created default to the standard unix-like /tmp ones, leaving the files open. We recommend explicitly changing the permissions after the creation of the directory, or removing uses of the vulnerable method\\n"
        },
        "products": [
          {
            "productID": "com.google.guava:guava:Maven:19.0",
            "supplier": ""
          }
        ],
        "vulnerability": {
          "statementID": "CVE-2020-8908",
          "description": "Information Disclosure in Guava"
        }
      }
    ]
  },
  "error": {
    "jackson-core": "No vulnerabilities found",
    "open_atrium": "No vulnerabilities found"
  }
};
