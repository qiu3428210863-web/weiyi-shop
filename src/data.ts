import { Product, Order, ShippingAddress } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'heritage-reserve-12y',
    name: '和风物语小酒 360mlx12瓶 批发装',
    sku: 'LS-8842-SPR',
    price: 360.0,
    originalPrice: 450.0,
    description: 'Heritage Reserve 系列为高标准工业蒸馏原酒，采用 12 年陈酿工艺，专专为大宗批发渠道优化包装与物流损耗控制。',
    image: '/images/heritage-reserve-12y.png',
    galleryImages: [
      '/images/heritage-reserve-12y.png',
      '/images/heritage-reserve-12y.png'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 842,
    abv: '6% VOL',
    origin: '福建，福州',
    barrelType: 'Ex-Bourbon',
    boxWeight: '15.8 kg',
    category: 'wine',
    tags: ['现货', '人气商品'],
    specs: [
      'Batch-consistent quality control (QC-204 protocol)',
      'Anti-tamper holographic security seals',
      'Eco-efficient modular packaging for pallet stacking'
    ],
    overviewNotes: '产品规格说明：单瓶 750ml，每箱 12 瓶，支持标准托盘运输。'
  },
  {
    id: 'highland-reserve-12y',
    name: '妖怪物语小果酒 368mlx12瓶 批发装',
    sku: 'WH-12-0042',
    price: 428.0,
    description: 'Highland Reserve 12年经典，口感顺滑细腻，带有熟透梨香与太妃糖的甘甜。大宗B2B原产地直供。',
    image: '/images/highland-reserve-12y.png',
    galleryImages: [
      '/images/highland-reserve-12y.png'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 1240,
    abv: '8% VOL',
    origin: '福建，福州',
    barrelType: 'Oak Sherry Cask',
    boxWeight: '16.2 kg',
    category: 'wine',
    tags: ['大宗直供'],
    specs: ['Sherry cask maturation profile', 'Secured shipping container configuration']
  },
  {
    id: 'botanist-dry-gin',
    name: '天气水果酒 300mlx12瓶 批发装',
    sku: 'GN-BT-9910',
    price: 330.0,
    description: '由植物学家特调配方复合草本金酒，清新脱俗。高频酒吧、宴会渠道首选供应原料酒。',
    image: '/images/botanist-dry-gin.png',
    galleryImages: [
      '/images/botanist-dry-gin.png'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 450,
    abv: '8% VOL',
    origin: '福建，福州',
    barrelType: 'Neutral Cask',
    boxWeight: '14.5 kg',
    category: 'wine',
    tags: ['小起降', '热销渠道酒'],
    specs: ['22 locally foraged botanicals', 'Tri-filtered steel vat finish']
  },
  {
    id: 'imperial-crystal-vodka',
    name: '態本態小熊酒 340mlx12瓶 批发装',
    sku: 'VK-IM-7721',
    price: 380.0,
    description: '采用高纯度谷物原液历经数十次高精活性炭过滤，纯净剔透如水晶。支持全国托盘运输。',
    image: '/images/imperial-crystal-vodka.png',
    galleryImages: [
      '/images/imperial-crystal-vodka.png'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 2180,
    abv: '10% VOL',
    origin: '福建，福州',
    barrelType: 'Vat',
    boxWeight: '15.0 kg',
    category: 'wine',
    tags: ['现货', '大宗首选'],
    specs: ['Active coal multi-pass filtering', 'Strict anti-shaking packing container']
  },
  {
    id: 'heritage-baijiu-500ml',
    name: '音律跳动水果酒 375mlx12瓶 批发装',
    sku: 'HB-500',
    price: 400.0,
    description: '精选优质青梅，传统陶缸自然发酵，果香馥郁酸甜均衡。冰镇后口感更佳，餐饮渠道热销爆款。',
    image: '/images/heritage-baijiu-500ml.png',
    galleryImages: [
      '/images/heritage-baijiu-500ml.png'
    ],
    moq: 12,
    quantityPerBox: 6,
    stock: 920,
    abv: '12% VOL',
    origin: '福建，福州',
    barrelType: 'Ceramic Jar',
    boxWeight: '11.2 kg',
    category: 'fruitwine',
    tags: ['有库存', '餐饮必备'],
    specs: ['当季鲜青梅采摘酿造', '无添加色素防腐剂', '低温发酵保留天然果香']
  },
  {
    id: 'fine-grain-base-liquor',
    name: '漫步大象洋酒系列 508mlx12瓶 批发装',
    sku: 'PG-750',
    price: 850.0,
    description: '新鲜桑葚物理压榨取汁，低温发酵工艺保留花青素营养。果香醇厚饱满，适合调配各类果饮。',
    image: '/images/fine-grain-base-liquor.png',
    galleryImages: [
      '/images/fine-grain-base-liquor.png'
    ],
    moq: 12,
    quantityPerBox: 4,
    stock: 120,
    abv: '40% VOL',
    origin: '福建，福州',
    barrelType: 'Stainless Tank',
    boxWeight: '18.5 kg',
    category: 'fruitwine',
    tags: ['库存紧张', '高浓度原浆'],
    specs: ['新鲜桑葚物理压榨', '无添加纯果发酵', '支持槽车或吨桶直发']
  },
  {
    id: 'royal-aged-10y',
    name: '態本態水果白兰地风味酒 375mlx12瓶 批发装',
    sku: 'IR-10Y',
    price: 3400.0,
    description: '长白山野生蓝莓十年封藏陈化，花青素含量极高，口感醇厚饱满带有蜜香。高端礼赠、定制果酒首选。',
    image: '/images/royal-aged-10y.png',
    galleryImages: [
      '/images/royal-aged-10y.png'
    ],
    moq: 12,
    quantityPerBox: 4,
    stock: 320,
    abv: '10% VOL',
    origin: '福建，福州',
    barrelType: 'Clay Pot Cellar',
    boxWeight: '9.8 kg',
    category: 'fruitwine',
    tags: ['有库存', '典藏果酿'],
    specs: ['长白山野生蓝莓原料', '10年陶坛物理陈化', '限量供应']
  },
  {
    id: 'classic-sorghum-liquor',
    name: '威尔马特黑森林小洋酒 375mlx12瓶 批发装',
    sku: 'CS-1000',
    price: 450.0,
    description: '新鲜苹果原汁发酵，清爽微气泡，口感清甜怡人。1L大容量家庭聚餐理想之选，支持定制果酒标。',
    image: '/images/classic-sorghum-liquor.png',
    galleryImages: [
      '/images/classic-sorghum-liquor.png'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 2400,
    abv: '40% VOL',
    origin: '福建，福州',
    barrelType: 'Stainless Tank',
    boxWeight: '22.4 kg',
    category: 'fruitwine',
    tags: ['有库存', '高性价比'],
    specs: ['鲜果原汁发酵', '微气泡清爽口感', '防破损加固泡沫纸箱']
  },
  {
    id: 'changzhou-premium-baijiu',
    name: '態本態椰味果酒 180mlx12瓶 批发装',
    sku: 'CZ-B-5201',
    price: 260.0,
    description: '常州本地东魁杨梅鲜果酿造，果香馥郁酸甜适口。冰镇后风味更佳，本地分销商大宗采购热卖常客。',
    image: '/images/changzhou-premium-baijiu.png',
    galleryImages: [
      '/images/changzhou-premium-baijiu.png'
    ],
    moq: 12,
    quantityPerBox: 6,
    stock: 580,
    abv: '6% VOL',
    origin: '福建，福州',
    barrelType: 'Stainless Tank',
    boxWeight: '11.8 kg',
    category: 'fruitwine',
    tags: ['常州特供', '鲜果酿造'],
    specs: ['常州自研果酒发酵工艺', '东魁杨梅鲜果酿造', '独家追溯防伪防串货镭射']
  },
  {
    id: 'cabernet-selection-red',
    name: '16型人格酒 80mlx12瓶 批发装',
    sku: 'CZ-RW-120',
    price: 128.0,
    description: '精选智利中央山谷赤霞珠葡萄酿制。饱含黑莓、橡木及辛香料气息。极高商超与婚宴回购率。',
    image: '/images/cabernet-selection-red.png',
    galleryImages: [
      '/images/cabernet-selection-red.png'
    ],
    moq: 12,
    quantityPerBox: 6,
    stock: 1400,
    abv: '17% vol',
    origin: '福建，福州',
    barrelType: 'French Oak Barrel',
    boxWeight: '9.2 kg',
    category: 'wine',
    tags: ['精选干红', '分销王牌'],
    specs: ['手工采摘赤霞珠原料', '12个月橡木桶窖藏', '整箱防震蜂窝网包装']
  },
  {
    id: 'stout-beer-can-24',
    name: '亲爱的你系列果酒 80mlx12瓶 批发装',
    sku: 'CZ-BP-001',
    price: 218.0,
    description: '焦香麦芽重度烘焙，泡沫极为丰富细腻持久。浓郁可可与咖啡余韵，大宗酒吧夜场热销款。',
    image: '/images/stout-beer-can-24.png',
    galleryImages: [
      '/images/stout-beer-can-24.png'
    ],
    moq: 12,
    quantityPerBox: 24,
    stock: 5000,
    abv: '18% VOL',
    origin: '福建，福州',
    barrelType: 'Stainless Steel Tank',
    boxWeight: '12.5 kg',
    category: 'beer',
    tags: ['爆款黑啤', '高浓原浆'],
    specs: ['双倍焦香麦芽高占比', '28天传统底低温发酵', '铝制易拉罐标准装 (500ml*24)']
  },
  {
    id: 'classic-light-aroma-baijiu',
    name: '今日宜果酒系列 330mlx12瓶 批发装',
    sku: 'CZ-W-500',
    price: 280.0,
    description: '岭南新鲜荔枝搭配蜂蜜低温共酿，清甜爽口，果香四溢。本色无添加，多仓配货支持货到承兑支付。',
    image: '/images/classic-light-aroma-baijiu.png',
    galleryImages: [
      '/images/classic-light-aroma-baijiu.png'
    ],
    moq: 12,
    quantityPerBox: 6,
    stock: 3200,
    abv: '8% VOL',
    origin: '福建，福州',
    barrelType: 'Stainless Tank',
    boxWeight: '11.0 kg',
    category: 'fruitwine',
    tags: ['月度爆款', '清甜果香'],
    specs: ['鲜荔枝与蜂蜜共酵', '低温慢发酵工艺', '重力瓦楞纸加固包装']
  },
  {
    id: 'premium-liquor-decanter',
    name: '爽一夹黄酒 325mlx12瓶 批发装',
    sku: 'AC-CRY-12',
    price: 360.0,
    description: '纯手工吹制高端无铅水晶醒酒器。专利多层空气对流接触器，让沉寂的酒香快速绽放。',
    image: '/images/premium-liquor-decanter.png',
    galleryImages: [
      '/images/premium-liquor-decanter.png'
    ],
    moq: 12,
    quantityPerBox: 1,
    stock: 240,
    abv: '8% VOL',
    origin: '福建，福州',
    barrelType: 'Hard-case Gift Box',
    boxWeight: '3.2 kg',
    category: 'accessories',
    tags: ['礼盒装', '分销必备'],
    specs: ['100% Lead-free Crystal Glass', 'Ergonomic easy pour rim', 'Premium velvet carry casing']
  },
  {
    id: 'matte-black-bottle-caps',
    name: '白兰地果酒 300mlx12瓶 批发装',
    sku: 'AC-CAP-03',
    price: 280.0,
    description: '专业烈酒、金酒开塞二次密封盖。食品级硅胶吸附体，防漏耐氧化，最大保留原桶香。',
    image: '/images/matte-black-bottle-caps.png',
    galleryImages: [
      '/images/matte-black-bottle-caps.png'
    ],
    moq: 12,
    quantityPerBox: 3,
    stock: 1200,
    abv: '6% VOL',
    origin: '福建，福州',
    barrelType: 'Blister Pack',
    boxWeight: '0.2 kg',
    category: 'accessories',
    tags: ['酒吧耗材'],
    specs: ['Heavy-duty zinc alloys', 'Double seal ring gasket', 'Dishes washer safe']
  },
  {
    id: 'cocktail-shaker-stainless',
    name: '凛冽火焰果酒 336mlx12瓶 批发装',
    sku: 'AC-SHK-01',
    price: 290.0,
    description: '加厚多段过滤一体抛光304不锈钢手摇壶。双重细滤网，高精度隔冰，手感极佳。',
    image: '/images/cocktail-shaker-stainless.png',
    galleryImages: [
      '/images/cocktail-shaker-stainless.png'
    ],
    moq: 12,
    quantityPerBox: 1,
    stock: 890,
    abv: '8% VOL',
    origin: '福建，福州',
    barrelType: 'Craft Paper Box',
    boxWeight: '1.2 kg',
    category: 'accessories',
    tags: ['调酒核心'],
    specs: ['304 Food-Grade Stainless Steel', 'Secured latch with high tolerances', 'Scratch anti-rub polish']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-01',
    code: '#LX-89241',
    date: '2025年10月24日 • 14:30',
    status: 'pending',
    items: [
      { productId: 'premium-liquor-decanter', quantity: 8, priceAtPurchase: 1250.0 },
      { productId: 'matte-black-bottle-caps', quantity: 20, priceAtPurchase: 120.0 }
    ],
    totalPrice: 12450.0
  },
  {
    id: 'order-02',
    code: '#LX-89102',
    date: '2025年10月21日 • 09:15',
    status: 'shipping',
    items: [
      { productId: 'cabernet-selection-red', quantity: 15, priceAtPurchase: 450.0 },
      { productId: 'changzhou-premium-baijiu', quantity: 12, priceAtPurchase: 1280.0 }
    ],
    totalPrice: 8120.0
  },
  {
    id: 'order-03',
    code: '#LX-88950',
    date: '2025年10月18日 • 16:45',
    status: 'completed',
    items: [
      { productId: 'cocktail-shaker-stainless', quantity: 10, priceAtPurchase: 290.0 }
    ],
    totalPrice: 2900.0
  }
];

export const INITIAL_ADDRESSES: ShippingAddress[] = [
  {
    id: 'addr-01',
    recipient: '李远',
    phone: '13816928842',
    province: '江苏省',
    city: '常州市',
    district: '武进区',
    detail: '太湖村东路xxxxx',
    isDefault: true
  },
  {
    id: 'addr-02',
    recipient: '高鑫零售有限公司',
    phone: '13912345678',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '外高桥xxxxxx',
    isDefault: false
  }
];

export const MOCK_CHATS_WELCOME = [
  {
    id: 'msg-01',
    sender: 'support' as const,
    text: '您好，这里是常州果酒厂官方服务客服。请问李先生今天有什么可以帮您的？目前常州3号仓库由于物流中心全面升级，出库流程优化，一般24小时内可发出。',
    timestamp: '下午 15:02'
  }
];
