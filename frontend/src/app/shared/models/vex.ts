interface VulnerabilityStatus {
  vulnStatus: string;
  justification: string;
  actionStatement: string;
  impactStatement: string;
}

interface Product {
  productID: string;
  supplier: string;
}

interface Vulnerability {
  statementID: string;
  description: string;
}

interface VexStatement {
  statementID: string;
  statementVersion: string;
  statementFirstIssued: string;
  statementLastUpdated: string;
  status: VulnerabilityStatus;
  products: Product[];
  vulnerability: Vulnerability;
}

interface Vex {
  vexIdentifier: string | null;
  originType: string;
  specVersion: string;
  docVersion: string;
  timeFirstIssued: string;
  timeLastUpdated: string;
  vexstatements: VexStatement[];
}

interface VexError {
  [key: string]: string;
}

export interface VexResponse {
  vex: Vex,
  error: VexError
}
