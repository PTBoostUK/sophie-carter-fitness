const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = 'https://bljbxzchhcjrhwntwell.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsamJ4emNoaGNqcmh3bnR3ZWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjIyOTAsImV4cCI6MjA3ODUzODI5MH0.GH1LBv3Yn9xn26mvq5eIZ9Bu7RNgcJ0HtXrd5cSSHoY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function uploadImage(localPath, storagePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath)
    const fileName = path.basename(localPath)
    
    console.log(`Uploading ${fileName} to ${storagePath}...`)
    
    const { data, error } = await supabase.storage
      .from('website-assets')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      })

    if (error) {
      console.error(`Error uploading ${fileName}:`, error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('website-assets')
      .getPublicUrl(storagePath)

    console.log(`✓ Uploaded ${fileName}: ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error(`Error uploading ${localPath}:`, error)
    return null
  }
}

async function seedImageToDatabase(section, field, imageUrl) {
  try {
    // Check if record exists
    const { data: existing } = await supabase
      .from('section_content')
      .select('id')
      .eq('section', section)
      .eq('field', field)
      .maybeSingle()

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from('section_content')
        .update({ value: imageUrl })
        .eq('section', section)
        .eq('field', field)
      
      if (error) throw error
      console.log(`✓ Updated database: ${section}.${field}`)
    } else {
      // Insert new
      const { error } = await supabase
        .from('section_content')
        .insert({ section, field, value: imageUrl })
      
      if (error) throw error
      console.log(`✓ Inserted to database: ${section}.${field}`)
    }
  } catch (error) {
    console.error(`Error seeding ${section}.${field} to database:`, error)
  }
}

async function main() {
  console.log('Starting image upload process...\n')

  const publicDir = path.join(__dirname, '..', 'public')
  
  // Upload the about image
  const aboutImagePath = path.join(publicDir, 'professional-female-personal-trainer-smiling-confi.jpg')
  
  if (fs.existsSync(aboutImagePath)) {
    const imageUrl = await uploadImage(aboutImagePath, 'images/about-image.jpg')
    if (imageUrl) {
      await seedImageToDatabase('about', 'image', imageUrl)
    }
  } else {
    console.log('⚠ About image not found, skipping...')
  }

  console.log('\n✓ Image upload process completed!')
}

main().catch(console.error)

