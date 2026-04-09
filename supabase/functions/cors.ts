export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // 필요시 특정 도메인으로 제한
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};
