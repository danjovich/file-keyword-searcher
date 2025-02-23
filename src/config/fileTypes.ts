// only .pdf, .docx, .doc and .xlsx files are allowed
export enum FileExtension {
  PDF = ".pdf",
  DOC = ".doc",
  DOCX = ".docx",
  XLSX = ".xlsx",
}

export enum FileMimeType {
  PDF = "application/pdf",
  DOC = "application/msword",
  DOCX = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
}

export const extensionsByMimetype = {
  [FileMimeType.PDF]: FileExtension.PDF,
  [FileMimeType.DOC]: FileExtension.DOC,
  [FileMimeType.DOCX]: FileExtension.DOCX,
  [FileMimeType.XLSX]: FileExtension.XLSX,
};
