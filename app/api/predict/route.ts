import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";

// Disable body parsing to handle raw file
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const form = new formidable.IncomingForm();

  return new Promise<NextResponse>((resolve, reject) => {
    form.parse(req as any, async (err, fields, files: any) => {
      if (err) {
        return reject(
          NextResponse.json({ error: err.message }, { status: 500 })
        );
      }

      const file = files.file;
      if (!file) {
        return reject(
          NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        );
      }

      try {
        // Read file into a buffer
        const buffer = fs.readFileSync(file.filepath);

        // Prepare FormData to send to Flask
        const formData = new FormData();
        formData.append("file", new Blob([buffer]), file.originalFilename);

        // Send to Flask backend
        const flaskRes = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: formData as any,
        });

        if (!flaskRes.ok) {
          const text = await flaskRes.text();
          throw new Error(text);
        }

        const data = await flaskRes.json();
        return resolve(NextResponse.json(data));
      } catch (e: any) {
        return reject(
          NextResponse.json({ error: e.message }, { status: 500 })
        );
      }
    });
  });
}
