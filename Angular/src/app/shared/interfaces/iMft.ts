export interface ImftFile {
    fileName: string,
    date: string,
    format: string
}
export interface ImftList {
    mftFile: ImftFile[],
}