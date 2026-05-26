import { chromium } from 'playwright';

const baseUrl = 'http://localhost:3002';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // iPhone 14 size

  // 1. Splash screen
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-splash.png', fullPage: false });
  console.log('1/8 Splash captured');

  // 2. Login screen - splash progress should finish
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-login.png', fullPage: false });
  console.log('2/8 Login captured');

  // 3. Click wholesaler prefill -> login
  await page.click('text=1. 批发采购商');
  await page.waitForTimeout(300);
  await page.click('text=安全验签并授权登录');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-home.png', fullPage: false });
  console.log('3/8 Home captured');

  // 4. Click cart button in header
  await page.click('button:has(svg.lucide-shopping-cart)');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-cart-sheet.png', fullPage: false });
  console.log('4/8 Cart sheet captured');
  // Close sheet
  await page.click('text=购物车清单 ~ button');

  // 5. Navigate to Cart tab
  await page.click('button:has-text("购物车"):not(:has-text("清单"))');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-cart.png', fullPage: false });
  console.log('5/8 Cart captured');

  // 6. Orders tab
  await page.click('button:has-text("订单"):not(:has-text("中心"))');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-orders.png', fullPage: false });
  console.log('6/8 Orders captured');

  // 7. Profile tab
  await page.click('button:has-text("我的"):not(:has-text("个人中心"))');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-profile.png', fullPage: false });
  console.log('7/8 Profile captured');

  // 8. Click product to see detail
  await page.click('button:has-text("首页")');
  await page.waitForTimeout(300);
  await page.click('text=和风物语 >> nth=0');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:/Users/Qiuxiaomin/Desktop/订货移动商城/snap-detail.png', fullPage: false });
  console.log('8/8 Detail captured');

  await browser.close();
  console.log('All captures done!');
}

capture().catch(console.error);
