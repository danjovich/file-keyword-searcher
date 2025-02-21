// only .pdf, .docx, .doc and .xlsx files are allowed
const extensionMyMimetype = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
} as const;

const fileTypes = {
  extensionMyMimetype,
  extensions: Object.values(extensionMyMimetype),
  mimeTypes: Object.keys(extensionMyMimetype),
};

export default fileTypes;
