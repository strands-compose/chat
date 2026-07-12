export const capabilities = {
  "categories": [
    {
      "category": "image",
      "formats": [
        {
          "format": "png",
          "extensions": [
            ".png"
          ],
          "mime_type": "image/png"
        },
        {
          "format": "jpeg",
          "extensions": [
            ".jpg",
            ".jpeg"
          ],
          "mime_type": "image/jpeg"
        },
        {
          "format": "gif",
          "extensions": [
            ".gif"
          ],
          "mime_type": "image/gif"
        },
        {
          "format": "webp",
          "extensions": [
            ".webp"
          ],
          "mime_type": "image/webp"
        }
      ]
    },
    {
      "category": "document",
      "formats": [
        {
          "format": "pdf",
          "extensions": [
            ".pdf"
          ],
          "mime_type": "application/pdf"
        },
        {
          "format": "csv",
          "extensions": [
            ".csv"
          ],
          "mime_type": "text/csv"
        },
        {
          "format": "doc",
          "extensions": [
            ".doc"
          ],
          "mime_type": "application/msword"
        },
        {
          "format": "docx",
          "extensions": [
            ".docx"
          ],
          "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        },
        {
          "format": "xls",
          "extensions": [
            ".xls"
          ],
          "mime_type": "application/vnd.ms-excel"
        },
        {
          "format": "xlsx",
          "extensions": [
            ".xlsx"
          ],
          "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        },
        {
          "format": "html",
          "extensions": [
            ".html",
            ".htm"
          ],
          "mime_type": "text/html"
        },
        {
          "format": "txt",
          "extensions": [
            ".txt"
          ],
          "mime_type": "text/plain"
        },
        {
          "format": "md",
          "extensions": [
            ".md"
          ],
          "mime_type": "text/markdown"
        }
      ]
    }
  ],
  "max_file_bytes": 5242880,
  "max_total_bytes": 20971520,
  "max_block_count": 10
};
