// only .pdf, .docx, .doc and .xlsx files are allowed
const fileTypes = {
  mimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  extensions: [".pdf", ".doc", ".docx", ".xlsx"],
};

export default fileTypes;
