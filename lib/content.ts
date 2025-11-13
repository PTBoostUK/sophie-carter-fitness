import { supabase } from './supabase'

export interface SectionContent {
  section: string
  field: string
  value: string
}

/**
 * Fetch all content for a specific section
 */
export async function getSectionContent(section: string): Promise<Record<string, string>> {
  try {
    const { data, error } = await supabase
      .from('section_content')
      .select('field, value')
      .eq('section', section)

    if (error) {
      console.error(`Error fetching ${section} content:`, error)
      return {}
    }

    const content: Record<string, string> = {}
    data?.forEach((item) => {
      content[item.field] = item.value
    })

    return content
  } catch (error) {
    console.error(`Error fetching ${section} content:`, error)
    return {}
  }
}

/**
 * Fetch all content grouped by section
 */
export async function getAllContent(): Promise<Record<string, Record<string, string>>> {
  try {
    const { data, error } = await supabase
      .from('section_content')
      .select('section, field, value')
      .order('section')

    if (error) {
      console.error('Error fetching all content:', error)
      return {}
    }

    const grouped: Record<string, Record<string, string>> = {}
    data?.forEach((item) => {
      if (!grouped[item.section]) {
        grouped[item.section] = {}
      }
      grouped[item.section][item.field] = item.value
    })

    return grouped
  } catch (error) {
    console.error('Error fetching all content:', error)
    return {}
  }
}

/**
 * Fetch theme settings
 */
export async function getThemeSettings(): Promise<{
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
}> {
  try {
    const { data, error } = await supabase.from('theme_settings').select('key, value')

    if (error) {
      console.error('Error fetching theme settings:', error)
      return {
        primaryColor: '#ec4899',
        secondaryColor: '#a855f7',
        accentColor: '#10b981',
        fontFamily: 'Montserrat',
      }
    }

    const theme: Record<string, string> = {}
    data?.forEach((item) => {
      theme[item.key] = item.value
    })

    return {
      primaryColor: theme.primaryColor || '#ec4899',
      secondaryColor: theme.secondaryColor || '#a855f7',
      accentColor: theme.accentColor || '#10b981',
      fontFamily: theme.fontFamily || 'Montserrat',
    }
  } catch (error) {
    console.error('Error fetching theme settings:', error)
    return {
      primaryColor: '#ec4899',
      secondaryColor: '#a855f7',
      accentColor: '#10b981',
      fontFamily: 'Montserrat',
    }
  }
}

