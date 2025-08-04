import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { OpenAI } from "openai";
import { supabase } from "~/server/supabase";
import { v4 as uuidv4 } from "uuid";
import pdfParse from "pdf-parse";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const cvRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        fullName: z.string(),
        email: z.string(),
        phone: z.string(),
        skills: z.string(),
        experience: z.string(),
        pdfBase64: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // 🔁 Upload PDF to Supabase
      const buffer = Buffer.from(input.pdfBase64, "base64");
      const pdfData = await pdfParse(buffer);
      const fileName = `${uuidv4()}.pdf`;
      const { data, error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET as string)
        .upload(fileName, buffer, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (error) {
        throw new Error("Failed to upload PDF: " + error.message);
      }

      const results = supabase
        .storage
        .from(process.env.SUPABASE_BUCKET as string)
        .getPublicUrl(fileName);

      console.log("Uploaded PDF to Supabase:", results.data.publicUrl);

      // 👇 You could skip parsing PDF altogether or still extract text via Supabase Edge function if needed

      const formDetails = `
      Full Name: ${input.fullName}
      Email: ${input.email}
      Phone: ${input.phone}
      Skills: ${input.skills}
      Experience: ${input.experience}
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that verifies if the user's CV matches the submitted form.",
          },
          {
            role: "user",
            content: `Here is the form submission:\n${formDetails}\n\nHere is the extracted CV text:\n${pdfData.text}\n\nList any mismatches, or say 'Match' if all details are present.`,
          },
        ],
      });

      const result =
        completion.choices &&
        completion.choices[0] &&
        completion.choices[0].message &&
        typeof completion.choices[0].message.content === "string"
          ? completion.choices[0].message.content
          : "No response from GPT.";

      // 💾 Save to DB
      await db.cvSubmission.create({
        data: {
          fullName: input.fullName,
          email: input.email,
          phone: input.phone,
          skills: input.skills,
          experience: input.experience,
          pdfUrl: results.data.publicUrl,
        },
      });

      return { message: result };
    }),
});
