#!/bin/bash
echo "🚀 Medi.AI Quick Setup"
start "https://resend.com/signup" 2>/dev/null
read -p "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbXhvd254c3R5dW5jbGx3eWVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDgzNDEzOSwiZXhwIjoyMDY2NDEwMTM5fQ.-2r24PfxLX1R335ynZaz9P8to9QD-thqx_71WUF5Xbc " key
echo "NEXT_PUBLIC_SUPABASE_URL=" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=" >> .env.local  
echo "RESEND_API_KEY=$key" >> .env.local
echo "✅ Done! Your .env.local:"
cat .env.local
