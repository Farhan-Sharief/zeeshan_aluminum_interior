const Category = require('../models/Category');
const Project = require('../models/Project');
const defaultCategories = require('../config/categories');
const normalizeCategoryName = require('./normalizeCategory');

async function runMigration() {
  console.log('🔄 Running Category Database Migration...');
  try {
    // 1. Insert default categories if they don't exist
    for (const cat of defaultCategories) {
      const normalized = normalizeCategoryName(cat);
      const exists = await Category.findOne({ name: normalized });
      if (!exists) {
        await Category.create({ name: normalized });
        console.log(`➕ Added default category: "${normalized}"`);
      }
    }

    // 2. Scan all existing projects in DB
    const projects = await Project.find({});
    console.log(`🔍 Found ${projects.length} existing projects to inspect.`);

    for (const project of projects) {
      const originalCategory = project.category;
      const normalized = normalizeCategoryName(originalCategory);

      // Update Project category to normalized title-cased if different
      if (originalCategory !== normalized) {
        project.category = normalized;
        await project.save();
        console.log(`✏️ Normalized project category from "${originalCategory}" to "${normalized}" for project "${project.title}"`);
      }

      // Make sure it exists in the Category master list
      const catExists = await Category.findOne({ name: normalized });
      if (!catExists) {
        await Category.create({ name: normalized });
        console.log(`➕ Registered missing category from project: "${normalized}"`);
      }
    }

    console.log('✅ Category migration completed successfully.');
  } catch (error) {
    console.error('❌ Category migration failed:', error);
  }
}

module.exports = runMigration;
