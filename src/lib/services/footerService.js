import { getSettings } from './settingsService';
import { getActiveCategories } from './categoryService';

// Get all footer data
export const getFooterData = async () => {
  try {
    const settingsResult = await getSettings();
    const categoriesResult = await getActiveCategories();
    
    return {
      success: true,
      data: {
        general: settingsResult.success ? settingsResult.settings.general : null,
        contact: settingsResult.success ? settingsResult.settings.contact : null,
        social: settingsResult.success ? settingsResult.settings.social : null,
        legal: settingsResult.success ? settingsResult.settings.legal : null,
        footer: settingsResult.success ? settingsResult.settings.footer : null,
        categories: categoriesResult.success ? categoriesResult.categories : [],
      }
    };
  } catch (error) {
    console.error('Error getting footer data:', error);
    return { success: false, error: error.message };
  }
};