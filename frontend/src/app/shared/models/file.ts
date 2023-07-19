import { SBOM } from "./sbom";

export default class File {
    sbom: SBOM | null = null;
    status: FileStatus;

    constructor() {
        this.status = FileStatus.LOADING;
    }


}

export enum FileStatus {
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  VALID = 'VALID',
}