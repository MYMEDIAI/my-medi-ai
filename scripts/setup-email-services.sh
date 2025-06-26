#!/bin/bash
echo "🚀 Medi.AI Quick Setup"
start "https://resend.com/signup" 2>/dev/null
read -p "Enter Resend API Key: " key
echo "NEXT_PUBLIC_SUPABASE_URL=" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=" >> .env.local  
echo "RESEND_API_KEY=$key" >> .env.local
echo "✅ Done! Your .env.local:"
cat .env.local
