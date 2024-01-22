import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import ExcelJS from "https://esm.sh/exceljs@4.2.0";

serve(async (_req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_ANON_KEY") as string
    );

    const { data } = supabase.storage
      .from("excel")
      .getPublicUrl("template.xlsx");

    const response = await fetch(data.publicUrl);
    if (!response.ok) {
      throw Error();
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    const worksheet = workbook.getWorksheet("栽培管理記録簿");
    worksheet.getCell("E2").value = "Hello World";

    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const { error } = await supabase.storage
      .from("excel")
      .upload("./record/test1.xlsx", blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({}), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, { status: 400 });
  }
});
