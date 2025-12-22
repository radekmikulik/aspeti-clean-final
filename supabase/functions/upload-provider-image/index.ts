Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { imageData, fileName, folder, userId } = await req.json();

    if (!imageData || !fileName || !folder || !userId) {
      return new Response(JSON.stringify({ 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Chybí povinné parametry: imageData, fileName, folder, userId' 
        } 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse base64 data
    const base64Data = imageData.split(',')[1];
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Create unique filename with userId
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fullPath = `${userId}/${folder}/${timestamp}-${sanitizedFileName}`;

    // Get Supabase configuration
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Chybí Supabase konfigurace');
    }

    // Upload to Supabase Storage
    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/provider-images/${fullPath}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'image/jpeg',
        },
        body: imageBuffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Storage upload error:', uploadResponse.status, errorText);
      throw new Error(`Upload selhal: ${uploadResponse.status} ${errorText}`);
    }

    // Get public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/provider-images/${fullPath}`;

    console.log('✅ File uploaded successfully:', {
      path: fullPath,
      publicUrl,
      size: imageBuffer.length
    });

    return new Response(JSON.stringify({ 
      data: { publicUrl },
      message: 'Obrázek úspěšně nahrán'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    const errorResponse = {
      error: {
        code: 'UPLOAD_ERROR',
        message: error.message || 'Neznámá chyba při uploadu'
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});