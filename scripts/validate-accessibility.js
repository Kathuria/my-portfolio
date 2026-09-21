/**
 * WCAG AAA Accessibility Validator for Cosmic Purple Palette
 * 
 * Tests all text/background color combinations for compliance with
 * WCAG 2.1 Level AAA contrast requirements (7:1 for normal text, 4.5:1 for large text)
 */

// Color Definitions
const COSMIC_PURPLE_PALETTE = {
  // Backgrounds
  backgrounds: {
    drawerMain: '#1a1a2e',
    cardElevated: '#25253a',
    sectionLight: '#2f2f47',
    inputDark: '#1e2233',
    videoBg: '#2a2a40',
    backdropOverlay: '#1a1a2e', // with 60% opacity
  },
  
  // Text Colors
  text: {
    primary: '#eeeef5',
    secondary: '#c4c4d8',
    tertiary: '#9595b8',
  },
  
  // Borders & Accents
  accents: {
    border: '#4a4a6d',
    lavender: '#8a8ac4',
    lavenderDark: '#6a6aa2',
  },
  
  // Cluster Colors (from graph nodes)
  clusters: {
    build: '#5EC8C0',     // Teal
    travel: '#E08D3C',    // Orange
    places: '#8FB37E',    // Green
    share: '#B18CD2',     // Purple
    journey: '#D4A574',   // Golden brown
  }
};

// Helper: Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Helper: Calculate relative luminance
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    const val = c / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Helper: Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Helper: Check WCAG compliance
function checkCompliance(ratio, level = 'AAA', size = 'normal') {
  const requirements = {
    AAA: { normal: 7, large: 4.5 },
    AA: { normal: 4.5, large: 3 }
  };
  
  const required = requirements[level][size];
  return {
    passes: ratio >= required,
    ratio: ratio.toFixed(2),
    required: required.toFixed(1),
    level,
    size
  };
}

// Helper: Get compliance icon
function getComplianceIcon(passes) {
  return passes ? '✅' : '❌';
}

// Helper: Get grade
function getGrade(ratio) {
  if (ratio >= 12) return 'A++';
  if (ratio >= 10) return 'A+';
  if (ratio >= 7) return 'A';
  if (ratio >= 4.5) return 'B';
  if (ratio >= 3) return 'C';
  return 'F';
}

// Main validation function
function validateAccessibility() {
  console.log('\n' + '='.repeat(80));
  console.log('🌌 COSMIC PURPLE PALETTE - WCAG AAA ACCESSIBILITY VALIDATION');
  console.log('='.repeat(80) + '\n');
  
  const results = {
    totalTests: 0,
    passedAAA: 0,
    passedAA: 0,
    failed: 0,
    details: []
  };
  
  // Test 1: Primary text on all backgrounds
  console.log('📋 TEST 1: PRIMARY TEXT (#eeeef5) ON ALL BACKGROUNDS\n');
  console.log('─'.repeat(80));
  
  Object.entries(COSMIC_PURPLE_PALETTE.backgrounds).forEach(([bgName, bgColor]) => {
    const ratio = getContrastRatio(COSMIC_PURPLE_PALETTE.text.primary, bgColor);
    const compliance = checkCompliance(ratio, 'AAA', 'normal');
    const grade = getGrade(ratio);
    
    results.totalTests++;
    if (compliance.passes) results.passedAAA++;
    else if (ratio >= 4.5) results.passedAA++;
    else results.failed++;
    
    results.details.push({
      test: `Primary text on ${bgName}`,
      foreground: COSMIC_PURPLE_PALETTE.text.primary,
      background: bgColor,
      ratio: compliance.ratio,
      passes: compliance.passes,
      grade
    });
    
    console.log(`${getComplianceIcon(compliance.passes)} ${bgName.padEnd(20)} | Ratio: ${compliance.ratio}:1 | Grade: ${grade.padEnd(4)} | ${compliance.passes ? 'WCAG AAA ✓' : 'WCAG AA ' + (ratio >= 4.5 ? '✓' : '✗')}`);
  });
  
  // Test 2: Secondary text on all backgrounds
  console.log('\n📋 TEST 2: SECONDARY TEXT (#c4c4d8) ON ALL BACKGROUNDS\n');
  console.log('─'.repeat(80));
  
  Object.entries(COSMIC_PURPLE_PALETTE.backgrounds).forEach(([bgName, bgColor]) => {
    const ratio = getContrastRatio(COSMIC_PURPLE_PALETTE.text.secondary, bgColor);
    const compliance = checkCompliance(ratio, 'AAA', 'normal');
    const grade = getGrade(ratio);
    
    results.totalTests++;
    if (compliance.passes) results.passedAAA++;
    else if (ratio >= 4.5) results.passedAA++;
    else results.failed++;
    
    results.details.push({
      test: `Secondary text on ${bgName}`,
      foreground: COSMIC_PURPLE_PALETTE.text.secondary,
      background: bgColor,
      ratio: compliance.ratio,
      passes: compliance.passes,
      grade
    });
    
    console.log(`${getComplianceIcon(compliance.passes)} ${bgName.padEnd(20)} | Ratio: ${compliance.ratio}:1 | Grade: ${grade.padEnd(4)} | ${compliance.passes ? 'WCAG AAA ✓' : 'WCAG AA ' + (ratio >= 4.5 ? '✓' : '✗')}`);
  });
  
  // Test 3: Tertiary text on all backgrounds
  console.log('\n📋 TEST 3: TERTIARY TEXT (#9595b8) ON ALL BACKGROUNDS\n');
  console.log('─'.repeat(80));
  
  Object.entries(COSMIC_PURPLE_PALETTE.backgrounds).forEach(([bgName, bgColor]) => {
    const ratio = getContrastRatio(COSMIC_PURPLE_PALETTE.text.tertiary, bgColor);
    const compliance = checkCompliance(ratio, 'AAA', 'normal');
    const grade = getGrade(ratio);
    
    results.totalTests++;
    if (compliance.passes) results.passedAAA++;
    else if (ratio >= 4.5) results.passedAA++;
    else results.failed++;
    
    results.details.push({
      test: `Tertiary text on ${bgName}`,
      foreground: COSMIC_PURPLE_PALETTE.text.tertiary,
      background: bgColor,
      ratio: compliance.ratio,
      passes: compliance.passes,
      grade
    });
    
    console.log(`${getComplianceIcon(compliance.passes)} ${bgName.padEnd(20)} | Ratio: ${compliance.ratio}:1 | Grade: ${grade.padEnd(4)} | ${compliance.passes ? 'WCAG AAA ✓' : 'WCAG AA ' + (ratio >= 4.5 ? '✓' : '✗')}`);
  });
  
  // Test 4: Cluster colors on drawer background
  console.log('\n📋 TEST 4: CLUSTER COLORS ON DRAWER BACKGROUND (#1a1a2e)\n');
  console.log('─'.repeat(80));
  
  Object.entries(COSMIC_PURPLE_PALETTE.clusters).forEach(([clusterName, color]) => {
    const ratio = getContrastRatio(color, COSMIC_PURPLE_PALETTE.backgrounds.drawerMain);
    const compliance = checkCompliance(ratio, 'AAA', 'large'); // Cluster buttons are typically larger
    const grade = getGrade(ratio);
    
    results.totalTests++;
    if (compliance.passes) results.passedAAA++;
    else if (ratio >= 3) results.passedAA++;
    else results.failed++;
    
    results.details.push({
      test: `${clusterName} cluster on drawer`,
      foreground: color,
      background: COSMIC_PURPLE_PALETTE.backgrounds.drawerMain,
      ratio: compliance.ratio,
      passes: compliance.passes,
      grade
    });
    
    console.log(`${getComplianceIcon(compliance.passes)} ${clusterName.padEnd(20)} | Ratio: ${compliance.ratio}:1 | Grade: ${grade.padEnd(4)} | ${compliance.passes ? 'WCAG AAA ✓' : 'WCAG AA ' + (ratio >= 3 ? '✓' : '✗')}`);
  });
  
  // Test 5: Border visibility
  console.log('\n📋 TEST 5: BORDER COLORS ON BACKGROUNDS\n');
  console.log('─'.repeat(80));
  
  const borderTests = [
    { name: 'Border on drawerMain', fg: COSMIC_PURPLE_PALETTE.accents.border, bg: COSMIC_PURPLE_PALETTE.backgrounds.drawerMain },
    { name: 'Border on cardElevated', fg: COSMIC_PURPLE_PALETTE.accents.border, bg: COSMIC_PURPLE_PALETTE.backgrounds.cardElevated },
    { name: 'Lavender on drawerMain', fg: COSMIC_PURPLE_PALETTE.accents.lavender, bg: COSMIC_PURPLE_PALETTE.backgrounds.drawerMain },
  ];
  
  borderTests.forEach(({ name, fg, bg }) => {
    const ratio = getContrastRatio(fg, bg);
    const compliance = checkCompliance(ratio, 'AA', 'normal'); // Borders typically need AA
    const grade = getGrade(ratio);
    
    results.totalTests++;
    if (ratio >= 7) results.passedAAA++;
    else if (ratio >= 4.5) results.passedAA++;
    else results.failed++;
    
    results.details.push({
      test: name,
      foreground: fg,
      background: bg,
      ratio: compliance.ratio,
      passes: compliance.passes,
      grade
    });
    
    console.log(`${getComplianceIcon(compliance.passes)} ${name.padEnd(25)} | Ratio: ${compliance.ratio}:1 | Grade: ${grade.padEnd(4)} | ${ratio >= 7 ? 'WCAG AAA ✓' : ratio >= 4.5 ? 'WCAG AA ✓' : 'Below AA ✗'}`);
  });
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 VALIDATION SUMMARY');
  console.log('='.repeat(80) + '\n');
  
  const aaaPercentage = ((results.passedAAA / results.totalTests) * 100).toFixed(1);
  const aaPercentage = (((results.passedAAA + results.passedAA) / results.totalTests) * 100).toFixed(1);
  
  console.log(`Total Tests:           ${results.totalTests}`);
  console.log(`WCAG AAA Passed:       ${results.passedAAA} (${aaaPercentage}%)`);
  console.log(`WCAG AA Passed:        ${results.passedAA}`);
  console.log(`Failed:                ${results.failed}\n`);
  
  if (results.failed === 0 && results.passedAAA === results.totalTests) {
    console.log('🎉 PERFECT SCORE! All combinations meet WCAG AAA standards!\n');
  } else if (results.failed === 0) {
    console.log('✅ EXCELLENT! All combinations meet at least WCAG AA standards!\n');
  } else {
    console.log('⚠️  WARNING! Some combinations do not meet accessibility standards.\n');
  }
  
  // Detailed issues
  const issues = results.details.filter(d => !d.passes);
  if (issues.length > 0) {
    console.log('🔍 ISSUES FOUND:\n');
    issues.forEach(issue => {
      console.log(`   ❌ ${issue.test}`);
      console.log(`      Foreground: ${issue.foreground}`);
      console.log(`      Background: ${issue.background}`);
      console.log(`      Ratio: ${issue.ratio}:1 (need 7:1 for AAA)`);
      console.log(`      Grade: ${issue.grade}\n`);
    });
  }
  
  // Recommendations
  console.log('💡 RECOMMENDATIONS:\n');
  
  const lowContrast = results.details.filter(d => parseFloat(d.ratio) < 7);
  if (lowContrast.length > 0) {
    console.log('   For elements with contrast below 7:1:');
    console.log('   • Use these only for large text (18pt+ or 14pt+ bold)');
    console.log('   • Consider lightening text colors for better contrast');
    console.log('   • Ensure critical UI elements use primary text color\n');
  } else {
    console.log('   ✨ No changes needed - palette is fully accessible!\n');
  }
  
  console.log('='.repeat(80) + '\n');
  
  return results;
}

// Run validation
if (require.main === module) {
  validateAccessibility();
}

module.exports = { validateAccessibility, getContrastRatio, checkCompliance };
