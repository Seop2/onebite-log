// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { corsHeaders } from "../cors.ts";

Deno.serve(async (req) => {
  // CORS 프리플라이트 대응
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const clientId = Deno.env.get("CHZZK_CLIENT_ID");
  const clientSecret = Deno.env.get("CHZZK_CLIENT_SECRET");

  // 💡 로그 확인: 앞의 4글자만 출력해서 확인 (보안 유지)
  console.log(`Client ID loaded: ${clientId?.substring(0, 4)}****`);
  console.log(`Client Secret loaded: ${clientSecret ? "YES" : "NO"}`);

  try {
    const url = new URL(req.url);
    const channelId = url.searchParams.get("channelId");

    // channelId가 없으면 바로 에러 반환
    if (!channelId) {
      console.error("Error: channelId is missing in request");
      return new Response(JSON.stringify({ error: "channelId is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // const clientId = Deno.env.get("CHZZK_CLIENT_ID");
    // const clientSecret = Deno.env.get("CHZZK_CLIENT_SECRET");

    const targetUrl =
      `https://api.chzzk.naver.com/service/v2/channels/${channelId}/live-detail`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    const data = await response.json();

    // 만약 네이버에서 에러를 줬다면 로그에 출력
    if (!response.ok) {
      console.error("Naver API Error Details:", data);
    }
    // 2. 결과 반환
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return new Response(JSON.stringify({ error: message, data: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
