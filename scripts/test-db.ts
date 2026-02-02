import 'dotenv/config'
import { Pool } from 'pg'

async function testConnection() {
  console.log('Testing database connection with raw pg...')
  
  // Parse connection string and rebuild without sslmode
  const baseUrl = process.env.DATABASE_URL?.split('?')[0]
  console.log('DATABASE_URL (base):', baseUrl?.substring(0, 80) + '...')
  
  // Direct pg connection with SSL configuration that overrides the URL
  const pool = new Pool({
    connectionString: baseUrl,
    ssl: {
      rejectUnauthorized: false  // Accept self-signed certificates
    }
  })

  try {
    // Test connection with a simple query
    console.log('\nAttempting to connect...')
    const client = await pool.connect()
    const result = await client.query('SELECT 1 as test')
    console.log('✅ Connection successful!')
    console.log('Query result:', result.rows)

    // Try to count customers
    console.log('\nCounting customers...')
    const customerResult = await client.query('SELECT COUNT(*) FROM customers')
    console.log(`Found ${customerResult.rows[0].count} customers`)

    // Try to count businesses
    console.log('\nCounting businesses...')
    const businessResult = await client.query('SELECT COUNT(*) FROM businesses')
    console.log(`Found ${businessResult.rows[0].count} businesses`)

    client.release()
  } catch (error) {
    console.error('❌ Connection failed!')
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

testConnection()
