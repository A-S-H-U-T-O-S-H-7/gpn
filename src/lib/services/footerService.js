import { getPublicSettings } from './settingsService';
import { getActiveCategories } from './categoryService';

export const getFooterData = async () => {
  try {
    const settingsResult = await getPublicSettings();
    const categoriesResult = await getActiveCategories();
    
    return {
      success: true,
      data: {
        general: settingsResult.success ? settingsResult.data.general : null,
        contact: settingsResult.success ? settingsResult.data.contact : null,
        social: settingsResult.success ? settingsResult.data.social : null,
        legal: settingsResult.success ? settingsResult.data.legal : null,
        footer: settingsResult.success ? settingsResult.data.footer : null,
        categories: categoriesResult.success ? categoriesResult.categories : [],
      }
    };
  } catch (error) {
    console.error('Error getting footer data:', error);
    return { success: false, error: error.message };
  }
};