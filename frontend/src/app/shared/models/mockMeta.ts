export const data = {
    "format" : "CycloneDX",
    "name" : "Test SBOM",
    "uid" : "12345678",
    "version" : "1.0.0",
    "specVersion" : "1.4",
    "licenses" : [ "MIT" ],
    "creationData" : {
      "creationTime" : "TEST TIMESTAMP",
      "authors" : [ {
        "name" : "Test Author",
        "email" : "author@publisher.xyz",
        "phone" : "123-456-7890"
      } ],
      "manufacture" : {
        "name" : "Manufacturer",
        "url" : "svip.xyz",
        "contacts" : [ {
          "name" : "SVIP",
          "email" : "manufacturer@svip.xyz",
          "phone" : "123-456-7890"
        } ]
      },
      "supplier" : {
        "name" : "Supplier",
        "url" : "svip.xyz",
        "contacts" : [ {
          "name" : "Supplier",
          "email" : "supplier@svip.xyz",
          "phone" : "123-456-7890"
        } ]
      },
      "licenses" : [ "MIT" ],
      "properties" : {
        "testProperty" : [ "testValue" ]
      },
      "creationTools" : [ {
        "vendor" : "SVIP",
        "name" : "SVIP Serializer",
        "version" : "1.0.0",
        "hashes" : {
          "SHA256" : "hash"
        }
      } ],
      "creatorComment" : "This SBOM was created for serializer testing"
    },
    "documentComment" : "Test Document Comment",
    "rootComponent" : {
      "type" : "type0",
      "uid" : "uid0",
      "author" : "author0",
      "name" : "COMPONENT 0",
      "licenses" : {
        "declared" : [ "declared0" ],
        "infoFromFiles" : [ "licenseFileText0" ],
        "concluded" : [ "concluded0" ],
        "comment" : "comment0"
      },
      "copyright" : "copyright0",
      "hashes" : {
        "SHA256" : "hash0"
      },
      "fileNotice" : "fileNotice0",
      "supplier" : {
        "name" : "SVIP",
        "url" : "0.svip.xyz",
        "contacts" : [ {
          "name" : "SVIP",
          "email" : "svip@svip.xyz",
          "phone" : "123-456-7890"
        } ]
      },
      "version" : "version0",
      "description" : {
        "summary" : "summary0",
        "description" : "extendedDescription0"
      },
      "cpes" : [ "cpe0" ],
      "purls" : [ "purl0" ],
      "downloadLocation" : "downloadLocation0",
      "fileName" : "fileName0",
      "filesAnalyzed" : true,
      "verificationCode" : "verificationCode0",
      "homePage" : "homePage0",
      "sourceInfo" : "sourceInfo0",
      "releaseDate" : "releaseDate0",
      "builtDate" : "buildDate0",
      "validUntilDate" : "validUntilDate0",
      "mimeType" : "mimeType0",
      "publisher" : "publisher0",
      "scope" : "scope0",
      "group" : "group0",
      "externalReferences" : [ {
        "url" : "0.svip.xyz",
        "type" : "0.svip.xyz",
        "category" : "testCategory",
        "hashes" : {
          "SHA256" : "hash0"
        }
      } ],
      "properties" : {
        "property0" : [ "value0" ]
      },
      "comment" : "comment0",
      "attributionText" : "attributionText0"
    },
    "components" : [ {
      "type" : "type1",
      "uid" : "uid1",
      "author" : "author1",
      "name" : "COMPONENT 1",
      "licenses" : {
        "declared" : [ "declared1" ],
        "infoFromFiles" : [ "licenseFileText1" ],
        "concluded" : [ "concluded1" ],
        "comment" : "comment1"
      },
      "copyright" : "copyright1",
      "hashes" : {
        "SHA256" : "hash1"
      },
      "fileNotice" : "fileNotice1",
      "supplier" : {
        "name" : "SVIP",
        "url" : "1.svip.xyz",
        "contacts" : [ {
          "name" : "SVIP",
          "email" : "svip@svip.xyz",
          "phone" : "123-456-7890"
        } ]
      },
      "version" : "version1",
      "description" : {
        "summary" : "summary1",
        "description" : "extendedDescription1"
      },
      "cpes" : [ "cpe1" ],
      "purls" : [ "purl1" ],
      "downloadLocation" : "downloadLocation1",
      "fileName" : "fileName1",
      "filesAnalyzed" : true,
      "verificationCode" : "verificationCode1",
      "homePage" : "homePage1",
      "sourceInfo" : "sourceInfo1",
      "releaseDate" : "releaseDate1",
      "builtDate" : "buildDate1",
      "validUntilDate" : "validUntilDate1",
      "mimeType" : "mimeType1",
      "publisher" : "publisher1",
      "scope" : "scope1",
      "group" : "group1",
      "externalReferences" : [ {
        "url" : "1.svip.xyz",
        "type" : "1.svip.xyz",
        "category" : "testCategory",
        "hashes" : {
          "SHA256" : "hash1"
        }
      } ],
      "properties" : {
        "property1" : [ "value1" ]
      },
      "comment" : "comment1",
      "attributionText" : "attributionText1"
    }, {
      "type" : "type2",
      "uid" : "uid2",
      "author" : "author2",
      "name" : "COMPONENT 2",
      "licenses" : {
        "declared" : [ "declared2" ],
        "infoFromFiles" : [ "licenseFileText2" ],
        "concluded" : [ "concluded2" ],
        "comment" : "comment2"
      },
      "copyright" : "copyright2",
      "hashes" : {
        "SHA256" : "hash2"
      },
      "fileNotice" : "fileNotice2",
      "supplier" : {
        "name" : "SVIP",
        "url" : "2.svip.xyz",
        "contacts" : [ {
          "name" : "SVIP",
          "email" : "svip@svip.xyz",
          "phone" : "123-456-7890"
        } ]
      },
      "version" : "version2",
      "description" : {
        "summary" : "summary2",
        "description" : "extendedDescription2"
      },
      "cpes" : [ "cpe2" ],
      "purls" : [ "purl2" ],
      "downloadLocation" : "downloadLocation2",
      "fileName" : "fileName2",
      "filesAnalyzed" : true,
      "verificationCode" : "verificationCode2",
      "homePage" : "homePage2",
      "sourceInfo" : "sourceInfo2",
      "releaseDate" : "releaseDate2",
      "builtDate" : "buildDate2",
      "validUntilDate" : "validUntilDate2",
      "mimeType" : "mimeType2",
      "publisher" : "publisher2",
      "scope" : "scope2",
      "group" : "group2",
      "externalReferences" : [ {
        "url" : "2.svip.xyz",
        "type" : "2.svip.xyz",
        "category" : "testCategory",
        "hashes" : {
          "SHA256" : "hash2"
        }
      } ],
      "properties" : {
        "property2" : [ "value2" ]
      },
      "comment" : "comment2",
      "attributionText" : "attributionText2"
    } ],
    "relationships" : {
      "Component 0" : [ {
        "otherUID" : "Component 1",
        "relationshipType" : "DESCRIBES",
        "comment" : "Test Relationship Comment"
      } ]
    },
    "externalReferences" : [ {
      "url" : "svip.xyz",
      "type" : "svip.xyz",
      "category" : "testCategory",
      "hashes" : {
        "SHA256" : "hash"
      }
    } ],
    "spdxlicenseListVersion" : "0.0"
  }