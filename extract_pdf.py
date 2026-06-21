from pypdf import PdfReader
import sys

reader = PdfReader(sys.argv[1])
with open("extracted.txt", "w", encoding="utf-8") as f:
    for i, page in enumerate(reader.pages):
        f.write(f"--- PAGE {i} ---\n")
        f.write(page.extract_text() + "\n")
        
        # Extract images
        for count, image_file_object in enumerate(page.images):
            filepath = f"assets/extracted_{i}_{count}_{image_file_object.name}"
            with open(filepath, "wb") as fp:
                fp.write(image_file_object.data)
            f.write(f"Extracted image {filepath}\n")
