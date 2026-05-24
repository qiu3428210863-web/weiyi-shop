import { Product, Order, ShippingAddress } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'heritage-reserve-12y',
    name: 'Heritage Reserve 单一麦芽 12年 - 750ml 批发装',
    sku: 'LS-8842-SPR',
    price: 1280.0,
    originalPrice: 1550.0,
    description: 'Heritage Reserve 系列为高标准工业蒸馏原酒，采用 12 年陈酿工艺，专专为大宗批发渠道优化包装与物流损耗控制。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ249jndy_xm2pWxze2B_Gkw2ogyVpa6y7JAvGx7GPLUJM9KlDpgC2ptmQppXCwYJ2ytWyzSdEceRt_IDMsRplUW3Q5oJZ3ddLwsmxF8epK7AmUQlIouwv7MN42fUQtCgZs92gMMS3L_8M0iTr_zmJBjMOfCzFC5wXYaJq_nZfuy48qFccumMh8pKw_BjpwNMjJ9KCyHSOWIcUrI3nVmx64QouY5ipfXGy01SqBz27UEMoAUpDOov7LvLGG_YrVAeNRrIr0ppeQyrn',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ249jndy_xm2pWxze2B_Gkw2ogyVpa6y7JAvGx7GPLUJM9KlDpgC2ptmQppXCwYJ2ytWyzSdEceRt_IDMsRplUW3Q5oJZ3ddLwsmxF8epK7AmUQlIouwv7MN42fUQtCgZs92gMMS3L_8M0iTr_zmJBjMOfCzFC5wXYaJq_nZfuy48qFccumMh8pKw_BjpwNMjJ9KCyHSOWIcUrI3nVmx64QouY5ipfXGy01SqBz27UEMoAUpDOov7LvLGG_YrVAeNRrIr0ppeQyrn',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTvSxJnZHJRjCVVWDPgNYe62U53QbfomUqhtqpCgT2dlNVjUlYTT5Ha_PmnXP_UCuLB6c3TyyxH6WiRqGxKWVZIy31t-O0x4rflhPPE9M0lfIQt_f6hZtOqShe-imDNFW3viPbRHe0zXvXasW7j0IsHYC7iVhjXUMfh0wXsn6oajlrscHANhjee8v6hPmRJpkxvV0jBhynoOJIQdICHEQrC1rLrtyzBm2WDhFYbiz37LJ2_4MTxZBRStJN_iaQd5mCOUfnWdEzQdmx'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 842,
    abv: '43% ABV',
    origin: 'Highland, SCO',
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
    name: 'Highland Reserve 12Y 耀世单一麦芽威士忌',
    sku: 'WH-12-0042',
    price: 428.0,
    description: 'Highland Reserve 12年经典，口感顺滑细腻，带有熟透梨香与太妃糖的甘甜。大宗B2B原产地直供。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSmVXg5UFwB3hdW1phijk3ul2bA3_C7iV7UwXiUHLzrNPfxdyOKJBVPHqtIGpvVCcan_yq5UwrRgmMxoVNTlNAR7aFa6DaM8iQQRx0U5Jf6Sz3xepZXU4ejnNru9s-FF4YneV0URk1OEO9SXHlQIpP8FMwYxo8S44dpxUlByIVGnGKNzgH1kgCj5cuhEAYy7Fs7zmGnURp4XBMOkMVYG5MIr3bpAPmtZKS-JYy77g7L6yedO7XD0LQvBTjBPB9KuBrRaYV5mXqCbP2',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSmVXg5UFwB3hdW1phijk3ul2bA3_C7iV7UwXiUHLzrNPfxdyOKJBVPHqtIGpvVCcan_yq5UwrRgmMxoVNTlNAR7aFa6DaM8iQQRx0U5Jf6Sz3xepZXU4ejnNru9s-FF4YneV0URk1OEO9SXHlQIpP8FMwYxo8S44dpxUlByIVGnGKNzgH1kgCj5cuhEAYy7Fs7zmGnURp4XBMOkMVYG5MIr3bpAPmtZKS-JYy77g7L6yedO7XD0LQvBTjBPB9KuBrRaYV5mXqCbP2'
    ],
    moq: 12,
    quantityPerBox: 12,
    stock: 1240,
    abv: '40% ABV',
    origin: 'Speyside, SCO',
    barrelType: 'Oak Sherry Cask',
    boxWeight: '16.2 kg',
    category: 'wine',
    tags: ['大宗直供'],
    specs: ['Sherry cask maturation profile', 'Secured shipping container configuration']
  },
  {
    id: 'botanist-dry-gin',
    name: 'Botanist Dry Gin Bulk 植物学家金酒 大宗装',
    sku: 'GN-BT-9910',
    price: 195.0,
    description: '由植物学家特调配方复合草本金酒，清新脱俗。高频酒吧、宴会渠道首选供应原料酒。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhvLaGaObd8sHOpChAHq9V-ukn5iBptvrf77CmA7pyxVPprNwuGKyZNbz2lzOYat_LzYy8SUQvgQij1Qu3pqO86zVxDWpNyJEcgxMnRDjnc7TKlJG3ja5HqlMPTTg9XRmnSH_COfizLF5SFv5tCxplg0lKf4DU69ByPqOymquoKTVw0VK7J3V026fVJKQDO5BjuF9NNfiIleK6mkOVKTl8mmJJYfrLQ8MoKXtk0oP9UrZvy36QuB5zp8zLxWHis6XbCMrSqLxv1f84',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhvLaGaObd8sHOpChAHq9V-ukn5iBptvrf77CmA7pyxVPprNwuGKyZNbz2lzOYat_LzYy8SUQvgQij1Qu3pqO86zVxDWpNyJEcgxMnRDjnc7TKlJG3ja5HqlMPTTg9XRmnSH_COfizLF5SFv5tCxplg0lKf4DU69ByPqOymquoKTVw0VK7J3V026fVJKQDO5BjuF9NNfiIleK6mkOVKTl8mmJJYfrLQ8MoKXtk0oP9UrZvy36QuB5zp8zLxWHis6XbCMrSqLxv1f84'
    ],
    moq: 6,
    quantityPerBox: 12,
    stock: 450,
    abv: '46% ABV',
    origin: 'Islay, SCO',
    barrelType: 'Neutral Cask',
    boxWeight: '14.5 kg',
    category: 'wine',
    tags: ['小起降', '热销渠道酒'],
    specs: ['22 locally foraged botanicals', 'Tri-filtered steel vat finish']
  },
  {
    id: 'imperial-crystal-vodka',
    name: 'Imperial Crystal Vodka 皇家水晶伏特加',
    sku: 'VK-IM-7721',
    price: 280.0,
    description: '采用高纯度谷物原液历经数十次高精活性炭过滤，纯净剔透如水晶。支持全国托盘运输。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3CRoUeUqcerHy9ZhRQCo79laOVZFHsoKIoMy1gzrFPsaaOkxzIKod4zac8vQwnbZSEvAysHYw0Jnn7UORmz3DUwUphAAEZIJnA0Vxej-abJCAVmF548bjGxLl5dgBplWJzjGf1P8C2rXmRdVEo1nfiA5sIlEHqefgOe_lwGHnvLdOeHHuem3OKG6OGt3hF7CMwXuecKQiZkHc-Z0eXrIDPQk9ueIrRUOoq343WmXneaY1S8d8-SMVQ2v7Mk3ut1PJ2eSGAZJOuFA',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ3CRoUeUqcerHy9ZhRQCo79laOVZFHsoKIoMy1gzrFPsaaOkxzIKod4zac8vQwnbZSEvAysHYw0Jnn7UORmz3DUwUphAAEZIJnA0Vxej-abJCAVmF548bjGxLl5dgBplWJzjGf1P8C2rXmRdVEo1nfiA5sIlEHqefgOe_lwGHnvLdOeHHuem3OKG6OGt3hF7CMwXuecKQiZkHc-Z0eXrIDPQk9ueIrRUOoq343WmXneaY1S8d8-SMVQ2v7Mk3ut1PJ2eSGAZJOuFA'
    ],
    moq: 24,
    quantityPerBox: 12,
    stock: 2180,
    abv: '40% ABV',
    origin: 'Warsaw, POL',
    barrelType: 'Vat',
    boxWeight: '15.0 kg',
    category: 'wine',
    tags: ['现货', '大宗首选'],
    specs: ['Active coal multi-pass filtering', 'Strict anti-shaking packing container']
  },
  {
    id: 'heritage-baijiu-500ml',
    name: '青梅精酿果酒 500ml 尊享装',
    sku: 'HB-500',
    price: 1280.0,
    description: '精选优质青梅，传统陶缸自然发酵，果香馥郁酸甜均衡。冰镇后口感更佳，餐饮渠道热销爆款。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqTnLzXFVXTQnX-ppK3o2O9lI9HVFvTvH7wF1yEXPS1mPO9K_qmtfIkLHKq7npR_jYaDgbUVuC4vQ2Td9NxrV2P1KsM_cJfSzUq51h9xQWnWuHNtMRH0npbXC-aMHTSPrDZ7HO7zWF92ltJVazVL2xCtNqZt1dmDUukwyajT2JPlcQAo4tf8s4wvgqbfAsRJ5VolTmYTCb4Z-uRB1FrStlgy2NDCzzRw2MeWtu7cnaX3MoOpkJMnsrLRp3fFOz7TX_riTq5K_cp8Sk',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqTnLzXFVXTQnX-ppK3o2O9lI9HVFvTvH7wF1yEXPS1mPO9K_qmtfIkLHKq7npR_jYaDgbUVuC4vQ2Td9NxrV2P1KsM_cJfSzUq51h9xQWnWuHNtMRH0npbXC-aMHTSPrDZ7HO7zWF92ltJVazVL2xCtNqZt1dmDUukwyajT2JPlcQAo4tf8s4wvgqbfAsRJ5VolTmYTCb4Z-uRB1FrStlgy2NDCzzRw2MeWtu7cnaX3MoOpkJMnsrLRp3fFOz7TX_riTq5K_cp8Sk'
    ],
    moq: 10,
    quantityPerBox: 6,
    stock: 920,
    abv: '12% vol',
    origin: 'Changzhou, CHN',
    barrelType: 'Ceramic Jar',
    boxWeight: '11.2 kg',
    category: 'fruitwine',
    tags: ['有库存', '餐饮必备'],
    specs: ['当季鲜青梅采摘酿造', '无添加色素防腐剂', '低温发酵保留天然果香']
  },
  {
    id: 'fine-grain-base-liquor',
    name: '桑葚发酵原液 大宗桶装',
    sku: 'PG-750',
    price: 850.0,
    description: '新鲜桑葚物理压榨取汁，低温发酵工艺保留花青素营养。果香醇厚饱满，适合调配各类果饮。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCbs5CHrI2oeBXw0NQSX8F0IHEw9xWg4x88gSNNLLLEjjeBPXcCJX_OgkZ4cnldzjX0tQw570h6JuMPqO4qBgUY40bhbEnmV4rDaOWU6ZndsV3xsKrnzEp6pWbphCpiCaC_6mv4Q8UgRChRqYAybdzQUTzgwvE6qO4KzR0i9MLoFNivG_j9whuMW4zsy995I4ODc69lYUQeO1_JX4FutoQ_PBgKT_fTSR37y0ChsNvmmcOD8pVm8nhsZtdIyYhkOjN6oDQGZHBsGzMW',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCbs5CHrI2oeBXw0NQSX8F0IHEw9xWg4x88gSNNLLLEjjeBPXcCJX_OgkZ4cnldzjX0tQw570h6JuMPqO4qBgUY40bhbEnmV4rDaOWU6ZndsV3xsKrnzEp6pWbphCpiCaC_6mv4Q8UgRChRqYAybdzQUTzgwvE6qO4KzR0i9MLoFNivG_j9whuMW4zsy995I4ODc69lYUQeO1_JX4FutoQ_PBgKT_fTSR37y0ChsNvmmcOD8pVm8nhsZtdIyYhkOjN6oDQGZHBsGzMW'
    ],
    moq: 5,
    quantityPerBox: 4,
    stock: 120,
    abv: '10% vol',
    origin: 'Changzhou, CHN',
    barrelType: 'Stainless Tank',
    boxWeight: '18.5 kg',
    category: 'fruitwine',
    tags: ['库存紧张', '高浓度原浆'],
    specs: ['新鲜桑葚物理压榨', '无添加纯果发酵', '支持槽车或吨桶直发']
  },
  {
    id: 'royal-aged-10y',
    name: '蓝莓十年陈酿 陶坛封藏',
    sku: 'IR-10Y',
    price: 3400.0,
    description: '长白山野生蓝莓十年封藏陈化，花青素含量极高，口感醇厚饱满带有蜜香。高端礼赠、定制果酒首选。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvhuzxnMEeWGBmQABk8kRXUU_sXbk3r1NOYsndMY4EC78LUT5FAXeu0yfSB5ZHytyLF9pifW6R-qrrPQy_iceXJ3w6VfmwluiLrSP_PyumaX5Hs7Vh18HeB8qJWda1HkfzAMVOFJs1gKB9SV5nZ0Nkrsmmki7LQSuA_sFvhDqK2QcWS23kckt6D9jtILGQrumAFQ8aGtPbe9_ISo9g55wf1jP-fB6iAKzzf0Zw1BNLBnpfDKy7To_Fqsgnu8NLWlblbR5azWEjPdsz',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDvhuzxnMEeWGBmQABk8kRXUU_sXbk3r1NOYsndMY4EC78LUT5FAXeu0yfSB5ZHytyLF9pifW6R-qrrPQy_iceXJ3w6VfmwluiLrSP_PyumaX5Hs7Vh18HeB8qJWda1HkfzAMVOFJs1gKB9SV5nZ0Nkrsmmki7LQSuA_sFvhDqK2QcWS23kckt6D9jtILGQrumAFQ8aGtPbe9_ISo9g55wf1jP-fB6iAKzzf0Zw1BNLBnpfDKy7To_Fqsgnu8NLWlblbR5azWEjPdsz'
    ],
    moq: 2,
    quantityPerBox: 4,
    stock: 320,
    abv: '15% vol',
    origin: 'Changzhou, CHN',
    barrelType: 'Clay Pot Cellar',
    boxWeight: '9.8 kg',
    category: 'fruitwine',
    tags: ['有库存', '典藏果酿'],
    specs: ['长白山野生蓝莓原料', '10年陶坛物理陈化', '限量供应']
  },
  {
    id: 'classic-sorghum-liquor',
    name: '苹果微醺果酒 1L餐配装',
    sku: 'CS-1000',
    price: 450.0,
    description: '新鲜苹果原汁发酵，清爽微气泡，口感清甜怡人。1L大容量家庭聚餐理想之选，支持定制果酒标。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaxoi0ocwEBpNcd0HjS2fbo9-_HmFzrwjo63i1CUk-b1kwWUhHT4bJ--2qIZHZLqvxzUlVv5YjgFp96RAayZIOPV1urVcO_St3CWi88qhTEjKMeZ8qPI8yq_IntKGRn9LftLaW0rwifAheD1zHv4riDexZcpt6FeAC_R-XjLQlbjaF_Syc_Po0k9DZrsooYA8rQ9n-LQ3IAMuLFzakZIVqI0_DE-WT6bk2IGuarKULR264VL6xftn3iIhQMfXhzkThTaPRWuCVNY5W',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaxoi0ocwEBpNcd0HjS2fbo9-_HmFzrwjo63i1CUk-b1kwWUhHT4bJ--2qIZHZLqvxzUlVv5YjgFp96RAayZIOPV1urVcO_St3CWi88qhTEjKMeZ8qPI8yq_IntKGRn9LftLaW0rwifAheD1zHv4riDexZcpt6FeAC_R-XjLQlbjaF_Syc_Po0k9DZrsooYA8rQ9n-LQ3IAMuLFzakZIVqI0_DE-WT6bk2IGuarKULR264VL6xftn3iIhQMfXhzkThTaPRWuCVNY5W'
    ],
    moq: 20,
    quantityPerBox: 12,
    stock: 2400,
    abv: '5% vol',
    origin: 'Changzhou, CHN',
    barrelType: 'Stainless Tank',
    boxWeight: '22.4 kg',
    category: 'fruitwine',
    tags: ['有库存', '高性价比'],
    specs: ['鲜果原汁发酵', '微气泡清爽口感', '防破损加固泡沫纸箱']
  },
  {
    id: 'changzhou-premium-baijiu',
    name: '常州杨梅果酒 500ml 官方特供',
    sku: 'CZ-B-5201',
    price: 1280.0,
    description: '常州本地东魁杨梅鲜果酿造，果香馥郁酸甜适口。冰镇后风味更佳，本地分销商大宗采购热卖常客。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMYocSAFiusZNcEeN6njaZEWesblQ5V_SDsdLS5Bwyr8tvLhBOgqH79UhWHqs4eTPO6OXfTJJuIj17rvyXzPY2KwKr59MZWe521HbA0M97ZSKuvWrIciTVctHxqwsWcFWquaoJRLjtFoC7K9zFut7pIZI4AgMjXjoClON-R08dWwGl8AOuaNj2hp5Z9uMQ5TZkta4FNgrLApb5ZAw0xSOKNIhEg63cQT-1uhFhGz5qvFXO5Lb6J99qAVQsjLEqH-nTU1vmdxLeHRCt',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMYocSAFiusZNcEeN6njaZEWesblQ5V_SDsdLS5Bwyr8tvLhBOgqH79UhWHqs4eTPO6OXfTJJuIj17rvyXzPY2KwKr59MZWe521HbA0M97ZSKuvWrIciTVctHxqwsWcFWquaoJRLjtFoC7K9zFut7pIZI4AgMjXjoClON-R08dWwGl8AOuaNj2hp5Z9uMQ5TZkta4FNgrLApb5ZAw0xSOKNIhEg63cQT-1uhFhGz5qvFXO5Lb6J99qAVQsjLEqH-nTU1vmdxLeHRCt'
    ],
    moq: 10,
    quantityPerBox: 6,
    stock: 580,
    abv: '10% vol',
    origin: 'Changzhou, CHN',
    barrelType: 'Stainless Tank',
    boxWeight: '11.8 kg',
    category: 'fruitwine',
    tags: ['常州特供', '鲜果酿造'],
    specs: ['常州自研果酒发酵工艺', '东魁杨梅鲜果酿造', '独家追溯防伪防串货镭射']
  },
  {
    id: 'cabernet-selection-red',
    name: '赤霞珠精选干红 750ml 智利原瓶',
    sku: 'CZ-RW-120',
    price: 450.0,
    description: '精选智利中央山谷赤霞珠葡萄酿制。饱含黑莓、橡木及辛香料气息。极高商超与婚宴回购率。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9p13uXCfNG1uf-7Gb7gqnClPAShoh5LwVVm3LKJm-npSZdeBDEmJY7vIWyVsZfxVwa1P_rrEkrqQH5A89hpHAnh_RJVENLL5VFCuibc5qknmHrVkbuxgMqjYNIwtjZPk_kXS54WPn2q2RYQq7F08ahbYLIt-KpoWQHDIdvoTZVMEdjvKu30E45XNzYvXaCmxUoS5LNdcePioODqBxdW2pGG-ClBEl3286DIiw_wyL7T1WECQ-6TyILP_8S6RWZPeJF8uRKR0kVyfP',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA9p13uXCfNG1uf-7Gb7gqnClPAShoh5LwVVm3LKJm-npSZdeBDEmJY7vIWyVsZfxVwa1P_rrEkrqQH5A89hpHAnh_RJVENLL5VFCuibc5qknmHrVkbuxgMqjYNIwtjZPk_kXS54WPn2q2RYQq7F08ahbYLIt-KpoWQHDIdvoTZVMEdjvKu30E45XNzYvXaCmxUoS5LNdcePioODqBxdW2pGG-ClBEl3286DIiw_wyL7T1WECQ-6TyILP_8S6RWZPeJF8uRKR0kVyfP'
    ],
    moq: 15,
    quantityPerBox: 6,
    stock: 1400,
    abv: '14% vol',
    origin: 'Maipo Valley, CHL',
    barrelType: 'French Oak Barrel',
    boxWeight: '9.2 kg',
    category: 'wine',
    tags: ['进口干红', '分销王牌'],
    specs: ['手工采摘赤霞珠原料', '12个月橡木桶窖藏', '整箱防震蜂窝网包装']
  },
  {
    id: 'stout-beer-can-24',
    name: '精品大麦原浆黑啤 (24听/箱)',
    sku: 'CZ-BP-001',
    price: 218.0,
    description: '焦香麦芽重度烘焙，泡沫极为丰富细腻持久。浓郁可可与咖啡余韵，大宗酒吧夜场热销款。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXSpbYURuSmonmX94Sb8iZxICpkMESd3zhSdJcu5RwGwqU-8acwoY3CFskEuDNktMazUPLaM-Z8HA1Misjy-bhZI7K3NcRISukUW2O2uxDlGdcp1BjQ3mGgnoI6O7C2yMVE7oEfXXLc8OGfdc8IYG3ZRWO0fWI38A_pjs1KE01kh0dsaUwznvekCdnxeYOj7Tczat0uouDd2CimZUA3T5xkaQZVPMaw90JOY3FfXtdpZzBkCj9n9rjjoHShzMtOBSNvmAx3ERquFBs',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXSpbYURuSmonmX94Sb8iZxICpkMESd3zhSdJcu5RwGwqU-8acwoY3CFskEuDNktMazUPLaM-Z8HA1Misjy-bhZI7K3NcRISukUW2O2uxDlGdcp1BjQ3mGgnoI6O7C2yMVE7oEfXXLc8OGfdc8IYG3ZRWO0fWI38A_pjs1KE01kh0dsaUwznvekCdnxeYOj7Tczat0uouDd2CimZUA3T5xkaQZVPMaw90JOY3FfXtdpZzBkCj9n9rjjoHShzMtOBSNvmAx3ERquFBs'
    ],
    moq: 5,
    quantityPerBox: 24,
    stock: 5000,
    abv: '8% vol',
    origin: 'Munich, GER',
    barrelType: 'Stainless Steel Tank',
    boxWeight: '12.5 kg',
    category: 'beer',
    tags: ['爆款黑啤', '高浓原浆'],
    specs: ['双倍焦香麦芽高占比', '28天传统底低温发酵', '铝制易拉罐标准装 (500ml*24)']
  },
  {
    id: 'classic-light-aroma-baijiu',
    name: '荔枝蜜酿果酒 500ml 散装特供',
    sku: 'CZ-W-500',
    price: 880.0,
    description: '岭南新鲜荔枝搭配蜂蜜低温共酿，清甜爽口，果香四溢。本色无添加，多仓配货支持货到承兑支付。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCETgd9u893Ye7mZ7Xtuu9MBf2mTMipYm8sP7ZUx3wd-Rir4OyyOpO3FjV3T610z7haUH56Cng3S0g5oyhDcMt5oNvwUZvTzw4n33-JaWcfqBqSEKPJ1HZCycTErBlp0Ynb4v3PnDRRtIZ5aGeYx3TbnPYyo7svk3RmZI8d58cbCdOcGPIhchleUQdec4LEDjtlzYWuvnjaXcgph_O6Fa7uzOE4ynSVc90pFIIrr0_cR-FH12fv8GMHb0NPO9eLlCEjrdNAAthmTEay',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCETgd9u893Ye7mZ7Xtuu9MBf2mTMipYm8sP7ZUx3wd-Rir4OyyOpO3FjV3T610z7haUH56Cng3S0g5oyhDcMt5oNvwUZvTzw4n33-JaWcfqBqSEKPJ1HZCycTErBlp0Ynb4v3PnDRRtIZ5aGeYx3TbnPYyo7svk3RmZI8d58cbCdOcGPIhchleUQdec4LEDjtlzYWuvnjaXcgph_O6Fa7uzOE4ynSVc90pFIIrr0_cR-FH12fv8GMHb0NPO9eLlCEjrdNAAthmTEay'
    ],
    moq: 10,
    quantityPerBox: 6,
    stock: 3200,
    abv: '8% vol',
    origin: 'Changzhou, CHN',
    barrelType: 'Stainless Tank',
    boxWeight: '11.0 kg',
    category: 'fruitwine',
    tags: ['月度爆款', '清甜果香'],
    specs: ['鲜荔枝与蜂蜜共酵', '低温慢发酵工艺', '重力瓦楞纸加固包装']
  },
  {
    id: 'premium-liquor-decanter',
    name: '水晶醒酒器 分流工艺刻奢款',
    sku: 'AC-CRY-12',
    price: 1250.0,
    description: '纯手工吹制高端无铅水晶醒酒器。专利多层空气对流接触器，让沉寂的酒香快速绽放。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTCfanwe8E71XuRy-kO2KW_GuKWqQF-n5YSJAL50O25APfUQ-wayXBg9xd-ynxiG2jAM4k0U3_OLrO20zK8tZEKOz2Q7HY0THNM5kp92L8HQ3ADtK7a5J_P7RnZ4HXlQuoXkYGMWIl4fLcSqGKKkaJDu33FSswBw23lK_R7ffU7IzYWSe4SrNiI0Zzxr6Qx2NgyYoOSaJaNDYEAptHUwoD4YCxXBvVoyWtOcbp5fH7pgWuD_0doyqQ2agN_QtTZcpzF0VqcuNNET7d',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBTCfanwe8E71XuRy-kO2KW_GuKWqQF-n5YSJAL50O25APfUQ-wayXBg9xd-ynxiG2jAM4k0U3_OLrO20zK8tZEKOz2Q7HY0THNM5kp92L8HQ3ADtK7a5J_P7RnZ4HXlQuoXkYGMWIl4fLcSqGKKkaJDu33FSswBw23lK_R7ffU7IzYWSe4SrNiI0Zzxr6Qx2NgyYoOSaJaNDYEAptHUwoD4YCxXBvVoyWtOcbp5fH7pgWuD_0doyqQ2agN_QtTZcpzF0VqcuNNET7d'
    ],
    moq: 5,
    quantityPerBox: 1,
    stock: 240,
    abv: 'Glass Only',
    origin: 'Austria',
    barrelType: 'Hard-case Gift Box',
    boxWeight: '3.2 kg',
    category: 'accessories',
    tags: ['礼盒装', '分销必备'],
    specs: ['100% Lead-free Crystal Glass', 'Ergonomic easy pour rim', 'Premium velvet carry casing']
  },
  {
    id: 'matte-black-bottle-caps',
    name: '尊享磨砂黑色金属密封瓶盖 (3个装)',
    sku: 'AC-CAP-03',
    price: 120.0,
    description: '专业烈酒、金酒开塞二次密封盖。食品级硅胶吸附体，防漏耐氧化，最大保留原桶香。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPpezGYPr1QLBkRjjBiouYiinxoUDnoqLmG80T7_8oBY9fQOiYuK97kO1JmAotRzwuhFQdqhTwdI2WMcrBgNOYP8uQOXVJeGZDlKZOKeOj6hrZ0mL9mbUaNWwHv0XthJrJrgDOjx56MroeXS169-9xAeqMM8VYtGRiOCLr1bcZPMF-QUsJKvCyOEVvTc_iaJVj7Zzd4JKYK45ex4ILcCaQ9MLqGoElxRI7UzhNt9KBA8RcLlg26EjZGcZj0dWNz2LkIrROVphynar4',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAPpezGYPr1QLBkRjjBiouYiinxoUDnoqLmG80T7_8oBY9fQOiYuK97kO1JmAotRzwuhFQdqhTwdI2WMcrBgNOYP8uQOXVJeGZDlKZOKeOj6hrZ0mL9mbUaNWwHv0XthJrJrgDOjx56MroeXS169-9xAeqMM8VYtGRiOCLr1bcZPMF-QUsJKvCyOEVvTc_iaJVj7Zzd4JKYK45ex4ILcCaQ9MLqGoElxRI7UzhNt9KBA8RcLlg26EjZGcZj0dWNz2LkIrROVphynar4'
    ],
    moq: 20,
    quantityPerBox: 3,
    stock: 1200,
    abv: 'Food Grade',
    origin: 'Shenzhen, CHN',
    barrelType: 'Blister Pack',
    boxWeight: '0.2 kg',
    category: 'accessories',
    tags: ['酒吧耗材'],
    specs: ['Heavy-duty zinc alloys', 'Double seal ring gasket', 'Dishes washer safe']
  },
  {
    id: 'cocktail-shaker-stainless',
    name: '不锈钢双重过滤调酒器大号 (750ml)',
    sku: 'AC-SHK-01',
    price: 290.0,
    description: '加厚多段过滤一体抛光304不锈钢手摇壶。双重细滤网，高精度隔冰，手感极佳。',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHds__Dd9F8qcFSYC4FGjZQGr2y8qyhz4Q-QN6JhYGpvwx5H3eSMp6sGBI_M5TXOad8DkwL-PK6OONogB1n6R_Fu9SDf-DVWH3vvzUS2gH15dH7pN2Xs8wgLBXJj2T3ot66-x8ah_DWBsS9V_f3AWPdnHiHP4drcWkU6ZSUv9au0z7wbtgrlzuG_1pEtcUXALZaiIezxnmDCz023accdRpyg4neChveQb0SpahifJ0bluuptDrWiKGQ0ctWv74ibvvOvTirftqoXE',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDQHds__Dd9F8qcFSYC4FGjZQGr2y8qyhz4Q-QN6JhYGpvwx5H3eSMp6sGBI_M5TXOad8DkwL-PK6OONogB1n6R_Fu9SDf-DVWH3vvzUS2gH15dH7pN2Xs8wgLBXJj2T3ot66-x8ah_DWBsS9V_f3AWPdnHiHP4drcWkU6ZSUv9au0z7wbtgrlzuG_1pEtcUXALZaiIezxnmDCz023accdRpyg4neChveQb0SpahifJ0bluuptDrWiKGQ0ctWv74ibvvOvTirftqoXE'
    ],
    moq: 10,
    quantityPerBox: 1,
    stock: 890,
    abv: 'HardwareOnly',
    origin: 'Niigata, JPN',
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
    date: '2023年10月24日 • 14:30',
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
    date: '2023年10月21日 • 09:15',
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
    date: '2023年10月18日 • 16:45',
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
    recipient: 'Marcus Chen （陈明）',
    phone: '13816928842',
    province: '江苏省',
    city: '常州市',
    district: '新北区',
    detail: '太湖东路大宗果酒保税1号库门面',
    isDefault: true
  },
  {
    id: 'addr-02',
    recipient: '全球烈酒分销公司 备用库',
    phone: '13912345678',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detail: '外高桥保税区富特北路36号4楼A区',
    isDefault: false
  }
];

export const MOCK_CHATS_WELCOME = [
  {
    id: 'msg-01',
    sender: 'support' as const,
    text: '您好，这里是常州果酒厂官方大宗服务客服。请问Marcus先生今天有什么可以帮您的？目前常州3号保税仓由于物流中心全面升级，出库流程优化，一般24小时内可发出。',
    timestamp: '下午 15:02'
  }
];
