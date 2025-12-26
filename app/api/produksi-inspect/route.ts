export const runtime = "nodejs";

import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const inspectId = searchParams.get("production_name") || "";

    if (!inspectId) {
        return NextResponse.json(
            {
                success: false,
                message: "Parameter inspect_id wajib diisi",
            },
            { status: 400 }
        );
    }

    try {
        const query = `
      SELECT 
        a.no_piece, 
        a.quantity,
        e.color_id,

        COALESCE(NULLIF(e.warna_custom, ''), f.name) AS warna_produk,

        c.name AS nama_produk,
        d.name AS production_name
        FROM stock_move_line_before AS a
        INNER JOIN product_product AS b 
        ON a.product_id = b.id
        INNER JOIN product_template AS c 
        ON b.product_tmpl_id = c.id
        INNER JOIN mrp_production AS d 
        ON a.production_id = d.id
        INNER JOIN produksi_inspect AS e
        ON a.inspect_id = e.id
        INNER JOIN product_attribute_value AS f
        ON e.color_id = f.id
        WHERE d.name =  $1
        AND a.grade_id NOT IN (3, 24)
    `;

        const { rows } = await pool.query(query, [inspectId]);

        const mod = rows.map((item, index) => ({
            ...item,
            no_piece: index + 1,
        }));

        return NextResponse.json({
            success: true,
            data: mod,
        });
    } catch (error: any) {
        console.error("DB ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}
