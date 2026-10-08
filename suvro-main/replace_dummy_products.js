const fs = require('fs');
const path = require('path');

const replacements = [
  { search: /Floor Mats Wrap Blouse/gi, replace: 'All-Weather Floor Mats' },
  { search: /Cashmere Turtleneck/gi, replace: 'Leather Seat Covers' },
  { search: /Leather Crossbody/gi, replace: 'Dashboard Mat' },
  { search: /engineered Dash Cams/gi, replace: 'HD Dash Cam' },
  { search: /Gold Plated Cuff/gi, replace: 'Alloy Wheel Rim' },
  { search: /Ceramic Vase/gi, replace: 'Car Perfume Diffuser' },
  { search: /Linen Lounge Set/gi, replace: 'Car Detailing Kit' },
  { search: /Woven Sun Hat/gi, replace: 'LED Headlight Bulbs' },
  { search: /Cashmere Wrap/gi, replace: 'Trunk Organizer' },
  { search: /Linen Blazer/gi, replace: 'Windshield Sunshade' },
  { search: /Signature Cashmere Scarf/gi, replace: 'Premium Microfiber Towel' },
  
  { search: /silk-wrap-blouse/g, replace: 'all-weather-floor-mats' },
  { search: /cashmere-turtleneck/g, replace: 'leather-seat-covers' },
  { search: /leather-crossbody/g, replace: 'dashboard-mat' },
  { search: /engineered-trousers/g, replace: 'hd-dash-cam' },
  { search: /gold-plated-cuff/g, replace: 'alloy-wheel-rim' },
  { search: /ceramic-vase/g, replace: 'car-perfume-diffuser' },
  { search: /linen-lounge-set/g, replace: 'car-detailing-kit' },
  { search: /woven-sun-hat/g, replace: 'led-headlight-bulbs' },
  { search: /cashmere-wrap/g, replace: 'trunk-organizer' },
  { search: /linen-blazer/g, replace: 'windshield-sunshade' },
  
  { search: /👚/g, replace: '🚗' },
  { search: /🧥/g, replace: '💺' },
  { search: /👜/g, replace: '🏎️' },
  { search: /👖/g, replace: '📹' },
  { search: /✨/g, replace: '🛞' },
  { search: /🏺/g, replace: '💨' },
  { search: /👘/g, replace: '🧽' },
  { search: /👒/g, replace: '💡' },
  { search: /👔/g, replace: '☀️' },
  
  // Replace the size/color arrays in dummy products to fitment/variants
  { search: /"XS", "S", "M", "L", "XL"/g, replace: '"Standard", "Premium", "Pro"' },
  { search: /"XS","S","M","L","XL"/g, replace: '"Standard","Premium","Pro"' },
  { search: /"Ivory", "Camel", "Black"/g, replace: '"Black", "Grey", "Red"' },
  { search: /"Ivory","Camel","Black"/g, replace: '"Black","Grey","Red"' },
  { search: /"Tan", "Black", "Burgundy"/g, replace: '"Black", "Carbon Fiber", "Matte"' },
  { search: /"Tan","Black","Burgundy"/g, replace: '"Black","Carbon Fiber","Matte"' },
  { search: /"Sand", "White", "Navy"/g, replace: '"Silver", "Black", "Red"' },
  { search: /"Sand","White","Navy"/g, replace: '"Silver","Black","Red"' },
  { search: /"Ivory", "Grey", "Navy"/g, replace: '"Black", "Grey", "Beige"' },
  { search: /"White", "Blush", "Black"/g, replace: '"Black", "Grey"' },
  
  // Category replacements
  { search: /category: "Home"/gi, replace: 'category: "Accessories"' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (content.match(r.search)) {
          content = content.replace(r.search, r.replace);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory('./frontend/components');
processDirectory('./frontend/app');
processDirectory('./frontend/lib');

console.log('Done replacing dummy products.');
