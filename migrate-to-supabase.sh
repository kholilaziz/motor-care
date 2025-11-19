#!/bin/bash

echo "🔄 MotorCare - Supabase Migration Script"
echo "===================================="

# Check if password is provided
if [ "$1" == "" ]; then
  echo "❌ Error: Please provide your Supabase database password"
  echo ""
  echo "Usage: ./migrate-to-supabase.sh YOUR_SUPABASE_PASSWORD"
  echo ""
  echo "You can find your password in Supabase Dashboard > Settings > Database"
  exit 1
fi

# Update .env file
echo "📝 Updating .env file with your password..."
sed -i "s/YOUR_SUPABASE_PASSWORD/$1/g" .env

# Check if update was successful
if grep -q "YOUR_SUPABASE_PASSWORD" .env; then
  echo "❌ Error: Failed to update .env file"
  exit 1
fi

echo "✅ .env file updated successfully"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Error: Failed to generate Prisma client"
  exit 1
fi

echo "✅ Prisma client generated successfully"

# Push schema to Supabase
echo "🚀 Pushing schema to Supabase..."
npx prisma db push

if [ $? -ne 0 ]; then
  echo "❌ Error: Failed to push schema to Supabase"
  echo "Please check your database password and connection"
  exit 1
fi

echo "✅ Schema pushed to Supabase successfully"

# Restart development server
echo "🔄 Restarting development server..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

echo "🎉 Migration completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Test the application at http://localhost:3000"
echo "3. Verify all API endpoints work correctly"
echo ""
echo "📚 For more information, see SUPABASE_MIGRATION.md"