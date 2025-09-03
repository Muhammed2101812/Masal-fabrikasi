// app/api/cover/route.ts

import { NextRequest } from 'next/server';

// Basit bir SVG placeholder döndüren endpoint
export async function POST(request: NextRequest) {
  try {
    const { category } = await request.json();
    
    // Validate input
    if (!category) {
      return new Response(
        JSON.stringify({ error: 'Kategori gereklidir.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Kategoriye göre basit bir SVG oluştur
    const svgs: Record<string, string> = {
      adventure: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#4F46E5"/>
        <circle cx="100" cy="100" r="50" fill="#FBBF24"/>
        <text x="100" y="105" text-anchor="middle" fill="white" font-family="Arial" font-size="16">M</text>
      </svg>`,
      fairyTale: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#EC4899"/>
        <circle cx="100" cy="100" r="50" fill="#FDFDFD"/>
        <text x="100" y="105" text-anchor="middle" fill="#EC4899" font-family="Arial" font-size="16">FT</text>
      </svg>`,
      animal: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#10B981"/>
        <circle cx="100" cy="100" r="50" fill="#FDFDFD"/>
        <text x="100" y="105" text-anchor="middle" fill="#10B981" font-family="Arial" font-size="16">A</text>
      </svg>`,
      space: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#3B82F6"/>
        <circle cx="100" cy="100" r="50" fill="#FDFDFD"/>
        <text x="100" y="105" text-anchor="middle" fill="#3B82F6" font-family="Arial" font-size="16">S</text>
      </svg>`
    };
    
    const svgContent = svgs[category] || svgs.adventure; // Default to adventure
    
    // Base64 encode the SVG
    const base64Svg = Buffer.from(svgContent).toString('base64');
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
    
    return new Response(
      JSON.stringify({ coverImage: dataUrl }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Kapak görseli oluşturulurken bir hata oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}