/** @Author Tina DiLorenzo */

export class SBOM implements ISBOM {
  [key: string]: any;
  format!: string;
  name!: string;
  uid!: string;
  version!: string | null;
  specVersion!: string;
  licenses!: string[];
  creationData!: {
    creationTime: string;
    authors: string[];
    manufacture: string | null;
    supplier: {
      name: string;
      url: string | null;
      contacts: {
        name: string;
        email: string | null;
        phone: string | null;
      }[];
    };
    licenses: string[];
    properties: {};
    creationTools: {
      vendor: string | null;
      name: string;
      version: string;
      hashes: {};
    }[];
    creatorComment: string | null;
  };
  documentComment!: string | null;
  rootComponent!: null;
  components!: {
    type: null;
    uid: string;
    author: string;
    name: string;
    licenses: {
      declared: string[];
      infoFromFiles: string[];
      concluded: string[];
      comment: string | null;
    };
    copyright: string;
    hashes: null;
    supplier: null;
    version: string;
    description: string | null;
    cpes: string[];
    purls: string[] | null;
    externalReferences: null;
    comment: string | null;
    attributionText: string | null;
    downloadLocation: string;
    fileName: string | null;
    filesAnalyzed: boolean;
    verificationCode: null;
    homePage: string | null;
    sourceInfo: string;
    releaseDate: string | null;
    builtDate: string | null;
    validUntilDate: string | null;
  }[];
  relationships!: {
    [component: string]: {
      otherUID: string;
      relationshipType: string;
      comment: string | null;
    }[];
  };

  constructor(sbom: ISBOM) {
    for (const [key, value] of Object.entries(sbom)) {
      this[key] = value;
    }
  }
}
export interface ISBOM {
  format: string;
  name: string;
  uid: string;
  version: string | null;
  specVersion: string;
  licenses: string[];
  creationData: {
    creationTime: string;
    authors: string[];
    manufacture: string | null;
    supplier: {
      name: string;
      url: string | null;
      contacts: {
        name: string;
        email: string | null;
        phone: string | null;
      }[];
    };
    licenses: string[];
    properties: {};
    creationTools: {
      vendor: string | null;
      name: string;
      version: string;
      hashes: {};
    }[];
    creatorComment: string | null;
  };
  documentComment: string | null;
  rootComponent: null;
  components: {
    type: null;
    uid: string;
    author: string;
    name: string;
    licenses: {
      declared: string[];
      infoFromFiles: string[];
      concluded: string[];
      comment: string | null;
    };
    copyright: string;
    hashes: null;
    supplier: null;
    version: string;
    description: string | null;
    cpes: string[];
    purls: string[] | null;
    externalReferences: null;
    comment: string | null;
    attributionText: string | null;
    downloadLocation: string;
    fileName: string | null;
    filesAnalyzed: boolean;
    verificationCode: null;
    homePage: string | null;
    sourceInfo: string;
    releaseDate: string | null;
    builtDate: string | null;
    validUntilDate: string | null;
  }[];
  relationships: {
    [component: string]: {
      otherUID: string;
      relationshipType: string;
      comment: string | null;
    }[];
  };
}
