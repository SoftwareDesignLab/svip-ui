/** Author: Tina DiLorenzo */
import { SBOM } from 'src/app/shared/models/sbom';
interface SBOMConflict {
  conflictTypes?: readonly any[];
  conflicts?: readonly any[];
}

interface ComponentConflict {
  componentA?: Attributes | null;
  componentB?: Attributes | null;
  conflictTypes?: readonly string[];
  conflicts?: readonly any[];
}

export interface Attributes {
  uuid?: string | null;
  name?: string | null;
  publisher?: string | null;
  unpackaged?: boolean;
  uniqueId?: string | null;
  uniqueIDType?: string | null;
  children?: readonly string[] | readonly [];
  version?: string | null;
  vulnerabilities?: string[] | [];
  licenses?: readonly string[] | readonly [] | null;
  conflicts?: any[] | [];
  componentName?: string | null;
  appearances?: readonly Number[];
  componentVersion?: readonly Number[] | readonly [] | string;
  packageManager?: string | null;
}

interface DiffReport {
  sbomConflict?: SBOMConflict;
  componentConflicts?: readonly ComponentConflict[];
}

export interface ComponentVersion {
  componentName?: string;
  componentVersion?: string;
  cpes: { [key: string]: Attributes };
  purls: { [key: string]: Attributes };
  swids: { [key: string]: Attributes };
  appearances: readonly number[] | readonly []; // number meaning SBOM ID
}

export interface Comparison {
  targetSBOM?: SBOM;
  diffReports: readonly DiffReport[];
  comparisons: { [key: string]: readonly ComponentVersion[] };
}
