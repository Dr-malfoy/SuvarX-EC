const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mysql = require('mysql2/promise');
const { DataTypes } = require('sequelize');
const app = require('./src/app');
const { connectDB, sequelize } = require('./src/config/db');
const bcrypt = require('bcryptjs');
const models = require('./src/models');
const { Section, User, Setting, Product, Category } = models;

const PORT = process.env.PORT || 5000;

// Ensure uploads directory exists and is writable
const uploadsDir = path.resolve(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o777 });
  }
  fs.chmodSync(uploadsDir, 0o777);
} catch (e) {
  console.warn('Upload directory check note:', e.message);
}

// Prevent unhandled errors from terminating Passenger process
process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

let dbReady = false;
let dbError = null;

// Attach status checker to app
app.set('dbStatus', () => ({ ready: dbReady, error: dbError }));

// Automatically checks and adds any missing columns across tables on startup
const ensureColumns = async () => {
  try {
    const qi = sequelize.getQueryInterface();
    const wanted = {
      products: {
        shortDescription: { type: DataTypes.STRING, allowNull: true },
        specifications: { type: DataTypes.JSON, allowNull: true },
        compatibility: { type: DataTypes.STRING, defaultValue: 'Not confirmed' },
        compatibleVehicles: { type: DataTypes.TEXT, allowNull: true },
        installationInstructions: { type: DataTypes.TEXT, allowNull: true },
        warrantyInformation: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.STRING, defaultValue: 'Published' },
        featured: { type: DataTypes.BOOLEAN, defaultValue: false },
        sku: { type: DataTypes.STRING, allowNull: true },
        brand: { type: DataTypes.STRING, allowNull: true },
        options: { type: DataTypes.JSON, allowNull: true },
      },
      orders: {
        fulfillmentStatus: { type: DataTypes.STRING, defaultValue: 'New' },
        paymentStatus: { type: DataTypes.STRING, defaultValue: 'Unpaid' },
        subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
        discount: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
        deliveryCharge: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 0 },
        adminNotes: { type: DataTypes.TEXT, allowNull: true },
        courierName: { type: DataTypes.STRING, allowNull: true },
        trackingNumber: { type: DataTypes.STRING, allowNull: true },
        dispatchDate: { type: DataTypes.DATE, allowNull: true },
        customerName: { type: DataTypes.STRING, allowNull: true },
        customerPhone: { type: DataTypes.STRING, allowNull: true },
      },
      abandoned_carts: {
        source: { type: DataTypes.STRING, defaultValue: 'checkout' },
        phone: { type: DataTypes.STRING, allowNull: true },
        name: { type: DataTypes.STRING, allowNull: true },
        address: { type: DataTypes.STRING, allowNull: true },
        city: { type: DataTypes.STRING, allowNull: true },
        country: { type: DataTypes.STRING, allowNull: true },
        zip: { type: DataTypes.STRING, allowNull: true },
      },
    };

    for (const [table, cols] of Object.entries(wanted)) {
      try {
        const existing = await qi.describeTable(table);
        for (const [name, def] of Object.entries(cols)) {
          if (!existing[name]) {
            try {
              await qi.addColumn(table, name, def);
              console.log(`Added missing column ${table}.${name}`);
            } catch (colErr) {
              console.warn(`Note on adding column ${table}.${name}:`, colErr.message);
            }
          }
        }
      } catch (tableErr) {
        // Table does not exist yet; will be created by sync()
      }
    }
  } catch (err) {
    console.warn('ensureColumns note:', err.message);
  }
};

// Creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD if it does not exist yet.
const ensureAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'admin.suvar@local.web').trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    if (!email || password.length < 6) return;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      const isMatch = await bcrypt.compare(password, existing.password).catch(() => false);
      if (!isMatch) {
        existing.password = await bcrypt.hash(password, 10);
        await existing.save();
        console.log(`Updated admin password for: ${email}`);
      }
      return;
    }
    await User.create({ name: 'Admin', email, password: await bcrypt.hash(password, 10), role: 'admin' });
    console.log(`Admin account created: ${email}`);
  } catch (err) {
    console.warn('ensureAdmin note:', err.message);
  }
};

const ensureDefaults = async () => {
  // Seed sections if empty
  try {
    const sectionCount = await Section.count();
    if (sectionCount === 0) {
      await Section.bulkCreate([
        { id: 'collection', label: 'Collection', desc: 'Main catalogue', emoji: '📁' },
        { id: 'new_arrival', label: 'New Arrival', desc: 'Latest drops', emoji: '✨' },
        { id: 'sale', label: 'Sale', desc: 'Discounted items', emoji: '🏷️' },
      ]);
      console.log('Seeded initial product sections.');
    }
  } catch (e) {
    console.warn('Section seed note:', e.message);
  }

  // Seed default settings if empty
  try {
    const settingCount = await Setting.count();
    if (settingCount === 0) {
      await Setting.bulkCreate([
        { key: 'hero_tag', value: 'SUMMER 2026 COLLECTION' },
        { key: 'hero_title_line1', value: 'NEW GENERATION OF' },
        { key: 'hero_title_line2', value: 'AUTOMOTIVE ELEGANCE' },
        { key: 'hero_desc', value: 'Designed for drivers who demand excellence in performance and aesthetic appeal.' },
        { key: 'brand_name', value: 'SUVAR' },
        { key: 'support_phone', value: '+880 1700-000000' },
        { key: 'support_email', value: 'support@suvarx.com' },
        { key: 'delivery_inside_dhaka', value: '80' },
        { key: 'delivery_outside_dhaka', value: '150' },
      ]);
      console.log('Seeded initial storefront settings.');
    }
  } catch (e) {
    console.warn('Setting seed note:', e.message);
  }
};

const initDatabase = async () => {
  try {
    // 1. Attempt to create database if permitted
    if (process.env.DB_NAME && process.env.DB_HOST) {
      try {
        const connection = await mysql.createConnection({
          host: (process.env.DB_HOST || 'localhost').trim(),
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.end();
        console.log(`Ensured database '${process.env.DB_NAME}' exists.`);
      } catch (dbCreateError) {
        console.log(`Note: Database creation skipped (${dbCreateError.message}). Assuming '${process.env.DB_NAME}' exists.`);
      }
    }

    // 2. Connect and sync tables
    await connectDB();
    const alter = process.env.DB_SYNC_ALTER === 'true';
    await sequelize.sync(alter ? { alter: true } : {});
    await ensureColumns();
    await ensureAdmin();
    await ensureDefaults();

    dbReady = true;
    dbError = null;
    console.log(`✓ Database fully initialized and ready (Sync alter: ${alter})`);
  } catch (err) {
    dbReady = false;
    dbError = err.message;
    console.error('Database initialization error (server stays alive):', err.message);
  }
};

// Start listening immediately so cPanel Phusion Passenger / LiteSpeed never throws 503
const server = app.listen(PORT, () => {
  console.log(`> Express backend server listening on port ${PORT} (mode: ${process.env.NODE_ENV || 'production'})`);
  // Initialize DB in background without blocking port binding
  initDatabase();
});

server.on('error', (err) => {
  console.error('Server HTTP socket error:', err);
});
