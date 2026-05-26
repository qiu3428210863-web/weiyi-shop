import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Navigate through splash
await page.locator('text=开启订货新时代').click();
await page.waitForTimeout(1500);

// Click the wholesaler pre-fill button
await page.locator('button:has-text("陈明")').click();
await page.waitForTimeout(500);

// Click submit
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3000);

await page.waitForTimeout(1000);

// Get ALL grid displays in the page
const gridInfo = await page.evaluate(() => {
  const allEls = document.querySelectorAll('div');
  const grids = [];
  for (const el of allEls) {
    const style = getComputedStyle(el);
    if (style.display === 'grid') {
      grids.push({
        cols: style.gridTemplateColumns,
        rows: style.gridTemplateRows,
        children: el.children.length,
        className: el.className.substring(0, 80),
      });
    }
  }
  return grids;
});

console.log('All grids:', JSON.stringify(gridInfo, null, 2));

// Find the product grid
const productInfo = await page.evaluate(() => {
  const allEls = document.querySelectorAll('div');
  let productGrid = null;
  for (const el of allEls) {
    if (getComputedStyle(el).display === 'grid' && el.children.length >= 8) {
      productGrid = el;
      break;
    }
  }
  if (!productGrid) return { error: 'no product grid found' };

  const cards = Array.from(productGrid.children).map((card, i) => {
    const rect = card.getBoundingClientRect();
    const cs = getComputedStyle(card);
    const firstChild = card.children[0];
    const lastChild = card.children[card.children.length - 1];
    return {
      index: i,
      top: Math.round(rect.top * 10) / 10,
      left: Math.round(rect.left * 10) / 10,
      width: Math.round(rect.width * 10) / 10,
      height: Math.round(rect.height * 10) / 10,
      bottom: Math.round(rect.bottom * 10) / 10,
      overflow: cs.overflow,
      display: cs.display,
      flexDirection: cs.flexDirection,
      alignSelf: cs.alignSelf,
      firstChildTag: firstChild?.tagName,
      firstChildHeight: firstChild ? Math.round(firstChild.getBoundingClientRect().height * 10) / 10 : null,
      lastChildTag: lastChild?.tagName,
      lastChildHeight: lastChild ? Math.round(lastChild.getBoundingClientRect().height * 10) / 10 : null,
    };
  });

  return { cards, gridClassName: productGrid.className.substring(0, 100) };
});

console.log('\nProduct Grid:');
if (productInfo.error) {
  console.log('Error:', productInfo.error);
} else {
  console.log(`Grid class: ${productInfo.gridClassName}`);
  const cards = productInfo.cards;
  console.log(`\n${cards.length} cards found:`);
  console.table(cards);

  for (let i = 0; i < cards.length; i += 2) {
    if (cards[i+1]) {
      const a = cards[i];
      const b = cards[i+1];
      const topDiff = Math.abs(a.top - b.top);
      const heightDiff = Math.abs(a.height - b.height);
      console.log(`\nRow ${Math.floor(i/2)}: Card${i} vs Card${i+1}:`);
      console.log(`  Top: ${a.top} vs ${b.top} (diff=${topDiff}${topDiff > 1 ? ' ⚠️' : ' ✓'})`);
      console.log(`  Height: ${a.height} vs ${b.height} (diff=${heightDiff}${heightDiff > 1 ? ' ⚠️' : ' ✓'})`);
      console.log(`  Card ${i} firstChildHeight: ${a.firstChildHeight}, Card ${i+1} firstChildHeight: ${b.firstChildHeight}`);
    }
  }
}

await browser.close();
