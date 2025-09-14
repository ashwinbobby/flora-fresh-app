import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import fetch from "node-fetch";

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
        reject(NextResponse.json({ error: err.message }, { status: 500 }));
        return;
      }

      const file = files.file;
      if (!file) {
        reject(NextResponse.json({ error: "No file uploaded" }, { status: 400 }));
        return;
      }

      // Read the uploaded file into a buffer
      const fileBuffer = fs.readFileSync(file.filepath);

      // Use FormData to send to Flask
      const formData = new FormData();
      formData.append("file", new Blob([fileBuffer]), file.originalFilename);

      const flaskRes = await fetch("http://localhost:5000/predict", {
        method: "POST",
        body: formData as any,
      });

      const data = await flaskRes.json();
      resolve(NextResponse.json(data));
    });
  });
}
