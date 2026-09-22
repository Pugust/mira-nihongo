'use strict';

const JAPANESE_DB = {
  person: { jp: '人', kana: 'ひと', romaji: 'hito', pt: 'pessoa', animate: true, actions: [
    { jp: '人を見ます。', romaji: 'Hito o mimasu.', pt: 'Olho para a pessoa.' }
  ]},
  bicycle: { jp: '自転車', kana: 'じてんしゃ', romaji: 'jitensha', pt: 'bicicleta', actions: [
    { jp: '自転車に乗ります。', romaji: 'Jitensha ni norimasu.', pt: 'Ando de bicicleta.' }
  ]},
  car: { jp: '車', kana: 'くるま', romaji: 'kuruma', pt: 'carro', actions: [
    { jp: '車に乗ります。', romaji: 'Kuruma ni norimasu.', pt: 'Entro/ando de carro.' }
  ]},
  motorcycle: { jp: 'バイク', kana: 'ばいく', romaji: 'baiku', pt: 'moto', actions: [
    { jp: 'バイクに乗ります。', romaji: 'Baiku ni norimasu.', pt: 'Ando de moto.' }
  ]},
  airplane: { jp: '飛行機', kana: 'ひこうき', romaji: 'hikōki', pt: 'avião', actions: [
    { jp: '飛行機に乗ります。', romaji: 'Hikōki ni norimasu.', pt: 'Viajo de avião.' }
  ]},
  bus: { jp: 'バス', kana: 'ばす', romaji: 'basu', pt: 'ônibus', actions: [
    { jp: 'バスに乗ります。', romaji: 'Basu ni norimasu.', pt: 'Pego o ônibus.' }
  ]},
  train: { jp: '電車', kana: 'でんしゃ', romaji: 'densha', pt: 'trem', actions: [
    { jp: '電車に乗ります。', romaji: 'Densha ni norimasu.', pt: 'Pego o trem.' }
  ]},
  truck: { jp: 'トラック', kana: 'とらっく', romaji: 'torakku', pt: 'caminhão' },
  boat: { jp: 'ボート', kana: 'ぼーと', romaji: 'bōto', pt: 'barco', actions: [
    { jp: 'ボートに乗ります。', romaji: 'Bōto ni norimasu.', pt: 'Ando de barco.' }
  ]},
  'traffic light': { jp: '信号', kana: 'しんごう', romaji: 'shingō', pt: 'semáforo', actions: [
    { jp: '信号を見ます。', romaji: 'Shingō o mimasu.', pt: 'Olho o semáforo.' }
  ]},
  'fire hydrant': { jp: '消火栓', kana: 'しょうかせん', romaji: 'shōkasen', pt: 'hidrante' },
  'stop sign': { jp: '止まれの標識', kana: 'とまれのひょうしき', romaji: 'tomare no hyōshiki', pt: 'placa de pare' },
  'parking meter': { jp: 'パーキングメーター', kana: 'ぱーきんぐめーたー', romaji: 'pākingu mētā', pt: 'parquímetro' },
  bench: { jp: 'ベンチ', kana: 'べんち', romaji: 'benchi', pt: 'banco', actions: [
    { jp: 'ベンチに座ります。', romaji: 'Benchi ni suwarimasu.', pt: 'Sento no banco.' }
  ]},
  bird: { jp: '鳥', kana: 'とり', romaji: 'tori', pt: 'pássaro', animate: true },
  cat: { jp: '猫', kana: 'ねこ', romaji: 'neko', pt: 'gato', animate: true, actions: [
    { jp: '猫を見ます。', romaji: 'Neko o mimasu.', pt: 'Olho para o gato.' }
  ]},
  dog: { jp: '犬', kana: 'いぬ', romaji: 'inu', pt: 'cachorro', animate: true, actions: [
    { jp: '犬を見ます。', romaji: 'Inu o mimasu.', pt: 'Olho para o cachorro.' }
  ]},
  horse: { jp: '馬', kana: 'うま', romaji: 'uma', pt: 'cavalo', animate: true },
  sheep: { jp: '羊', kana: 'ひつじ', romaji: 'hitsuji', pt: 'ovelha', animate: true },
  cow: { jp: '牛', kana: 'うし', romaji: 'ushi', pt: 'vaca', animate: true },
  elephant: { jp: '象', kana: 'ぞう', romaji: 'zō', pt: 'elefante', animate: true },
  bear: { jp: '熊', kana: 'くま', romaji: 'kuma', pt: 'urso', animate: true },
  zebra: { jp: 'シマウマ', kana: 'しまうま', romaji: 'shimauma', pt: 'zebra', animate: true },
  giraffe: { jp: 'キリン', kana: 'きりん', romaji: 'kirin', pt: 'girafa', animate: true },
  backpack: { jp: 'リュック', kana: 'りゅっく', romaji: 'ryukku', pt: 'mochila', actions: [
    { jp: 'リュックを持ちます。', romaji: 'Ryukku o mochimasu.', pt: 'Pego/carrego a mochila.' }
  ]},
  umbrella: { jp: '傘', kana: 'かさ', romaji: 'kasa', pt: 'guarda-chuva', actions: [
    { jp: '傘を使います。', romaji: 'Kasa o tsukaimasu.', pt: 'Uso o guarda-chuva.' }
  ]},
  handbag: { jp: 'ハンドバッグ', kana: 'はんどばっぐ', romaji: 'handobaggu', pt: 'bolsa', actions: [
    { jp: 'ハンドバッグを持ちます。', romaji: 'Handobaggu o mochimasu.', pt: 'Carrego a bolsa.' }
  ]},
  tie: { jp: 'ネクタイ', kana: 'ねくたい', romaji: 'nekutai', pt: 'gravata', actions: [
    { jp: 'ネクタイをします。', romaji: 'Nekutai o shimasu.', pt: 'Coloco/uso uma gravata.' }
  ]},
  suitcase: { jp: 'スーツケース', kana: 'すーつけーす', romaji: 'sūtsukēsu', pt: 'mala', actions: [
    { jp: 'スーツケースを持ちます。', romaji: 'Sūtsukēsu o mochimasu.', pt: 'Carrego a mala.' }
  ]},
  frisbee: { jp: 'フリスビー', kana: 'ふりすびー', romaji: 'furisubī', pt: 'frisbee', actions: [
    { jp: 'フリスビーを投げます。', romaji: 'Furisubī o nagemasu.', pt: 'Jogo o frisbee.' }
  ]},
  skis: { jp: 'スキー', kana: 'すきー', romaji: 'sukī', pt: 'esquis', actions: [
    { jp: 'スキーをします。', romaji: 'Sukī o shimasu.', pt: 'Esquio.' }
  ]},
  snowboard: { jp: 'スノーボード', kana: 'すのーぼーど', romaji: 'sunōbōdo', pt: 'snowboard', actions: [
    { jp: 'スノーボードをします。', romaji: 'Sunōbōdo o shimasu.', pt: 'Pratico snowboard.' }
  ]},
  'sports ball': { jp: 'ボール', kana: 'ぼーる', romaji: 'bōru', pt: 'bola', actions: [
    { jp: 'ボールを投げます。', romaji: 'Bōru o nagemasu.', pt: 'Jogo a bola.' }
  ]},
  kite: { jp: '凧', kana: 'たこ', romaji: 'tako', pt: 'pipa', actions: [
    { jp: '凧を揚げます。', romaji: 'Tako o agemasu.', pt: 'Solto pipa.' }
  ]},
  'baseball bat': { jp: 'バット', kana: 'ばっと', romaji: 'batto', pt: 'taco de beisebol', actions: [
    { jp: 'バットを使います。', romaji: 'Batto o tsukaimasu.', pt: 'Uso o taco.' }
  ]},
  'baseball glove': { jp: '野球のグローブ', kana: 'やきゅうのぐろーぶ', romaji: 'yakyū no gurōbu', pt: 'luva de beisebol' },
  skateboard: { jp: 'スケートボード', kana: 'すけーとぼーど', romaji: 'sukēto bōdo', pt: 'skate', actions: [
    { jp: 'スケートボードに乗ります。', romaji: 'Sukēto bōdo ni norimasu.', pt: 'Ando de skate.' }
  ]},
  surfboard: { jp: 'サーフボード', kana: 'さーふぼーど', romaji: 'sāfubōdo', pt: 'prancha de surfe' },
  'tennis racket': { jp: 'テニスラケット', kana: 'てにすらけっと', romaji: 'tenisu raketto', pt: 'raquete de tênis', actions: [
    { jp: 'テニスラケットを使います。', romaji: 'Tenisu raketto o tsukaimasu.', pt: 'Uso a raquete de tênis.' }
  ]},
  bottle: { jp: 'ボトル', kana: 'ぼとる', romaji: 'botoru', pt: 'garrafa', actions: [
    { jp: 'ボトルを取ります。', romaji: 'Botoru o torimasu.', pt: 'Pego a garrafa.' },
    { jp: 'ボトルを置きます。', romaji: 'Botoru o okimasu.', pt: 'Coloco a garrafa.' }
  ]},
  'wine glass': { jp: 'ワイングラス', kana: 'わいんぐらす', romaji: 'waingurasu', pt: 'taça', actions: [
    { jp: 'ワイングラスを持ちます。', romaji: 'Waingurasu o mochimasu.', pt: 'Seguro a taça.' }
  ]},
  cup: { jp: 'コップ', kana: 'こっぷ', romaji: 'koppu', pt: 'copo', actions: [
    { jp: 'コップを取ります。', romaji: 'Koppu o torimasu.', pt: 'Pego o copo.' },
    { jp: 'コップを使います。', romaji: 'Koppu o tsukaimasu.', pt: 'Uso o copo.' }
  ]},
  fork: { jp: 'フォーク', kana: 'ふぉーく', romaji: 'fōku', pt: 'garfo', actions: [
    { jp: 'フォークを使います。', romaji: 'Fōku o tsukaimasu.', pt: 'Uso o garfo.' }
  ]},
  knife: { jp: 'ナイフ', kana: 'ないふ', romaji: 'naifu', pt: 'faca', actions: [
    { jp: 'ナイフを使います。', romaji: 'Naifu o tsukaimasu.', pt: 'Uso a faca.' }
  ]},
  spoon: { jp: 'スプーン', kana: 'すぷーん', romaji: 'supūn', pt: 'colher', actions: [
    { jp: 'スプーンを使います。', romaji: 'Supūn o tsukaimasu.', pt: 'Uso a colher.' }
  ]},
  bowl: { jp: 'ボウル', kana: 'ぼうる', romaji: 'bōru', pt: 'tigela', actions: [
    { jp: 'ボウルを使います。', romaji: 'Bōru o tsukaimasu.', pt: 'Uso a tigela.' }
  ]},
  banana: { jp: 'バナナ', kana: 'ばなな', romaji: 'banana', pt: 'banana', actions: [
    { jp: 'バナナを食べます。', romaji: 'Banana o tabemasu.', pt: 'Como a banana.' }
  ]},
  apple: { jp: 'りんご', kana: 'りんご', romaji: 'ringo', pt: 'maçã', actions: [
    { jp: 'りんごを食べます。', romaji: 'Ringo o tabemasu.', pt: 'Como a maçã.' }
  ]},
  sandwich: { jp: 'サンドイッチ', kana: 'さんどいっち', romaji: 'sandoicchi', pt: 'sanduíche', actions: [
    { jp: 'サンドイッチを食べます。', romaji: 'Sandoicchi o tabemasu.', pt: 'Como o sanduíche.' }
  ]},
  orange: { jp: 'オレンジ', kana: 'おれんじ', romaji: 'orenji', pt: 'laranja', actions: [
    { jp: 'オレンジを食べます。', romaji: 'Orenji o tabemasu.', pt: 'Como a laranja.' }
  ]},
  broccoli: { jp: 'ブロッコリー', kana: 'ぶろっこりー', romaji: 'burokkorī', pt: 'brócolis', actions: [
    { jp: 'ブロッコリーを食べます。', romaji: 'Burokkorī o tabemasu.', pt: 'Como o brócolis.' }
  ]},
  carrot: { jp: 'にんじん', kana: 'にんじん', romaji: 'ninjin', pt: 'cenoura', actions: [
    { jp: 'にんじんを食べます。', romaji: 'Ninjin o tabemasu.', pt: 'Como a cenoura.' }
  ]},
  'hot dog': { jp: 'ホットドッグ', kana: 'ほっとどっぐ', romaji: 'hottodoggu', pt: 'cachorro-quente', actions: [
    { jp: 'ホットドッグを食べます。', romaji: 'Hottodoggu o tabemasu.', pt: 'Como o cachorro-quente.' }
  ]},
  pizza: { jp: 'ピザ', kana: 'ぴざ', romaji: 'piza', pt: 'pizza', actions: [
    { jp: 'ピザを食べます。', romaji: 'Piza o tabemasu.', pt: 'Como a pizza.' }
  ]},
  donut: { jp: 'ドーナツ', kana: 'どーなつ', romaji: 'dōnatsu', pt: 'donut', actions: [
    { jp: 'ドーナツを食べます。', romaji: 'Dōnatsu o tabemasu.', pt: 'Como o donut.' }
  ]},
  cake: { jp: 'ケーキ', kana: 'けーき', romaji: 'kēki', pt: 'bolo', actions: [
    { jp: 'ケーキを食べます。', romaji: 'Kēki o tabemasu.', pt: 'Como o bolo.' }
  ]},
  chair: { jp: '椅子', kana: 'いす', romaji: 'isu', pt: 'cadeira', actions: [
    { jp: '椅子に座ります。', romaji: 'Isu ni suwarimasu.', pt: 'Sento na cadeira.' }
  ]},
  couch: { jp: 'ソファ', kana: 'そふぁ', romaji: 'sofa', pt: 'sofá', actions: [
    { jp: 'ソファに座ります。', romaji: 'Sofa ni suwarimasu.', pt: 'Sento no sofá.' }
  ]},
  'potted plant': { jp: '鉢植え', kana: 'はちうえ', romaji: 'hachiue', pt: 'planta em vaso', actions: [
    { jp: '鉢植えを見ます。', romaji: 'Hachiue o mimasu.', pt: 'Olho para a planta em vaso.' }
  ]},
  bed: { jp: 'ベッド', kana: 'べっど', romaji: 'beddo', pt: 'cama', actions: [
    { jp: 'ベッドで寝ます。', romaji: 'Beddo de nemasu.', pt: 'Durmo na cama.' }
  ]},
  'dining table': { jp: 'テーブル', kana: 'てーぶる', romaji: 'tēburu', pt: 'mesa', actions: [
    { jp: 'テーブルを使います。', romaji: 'Tēburu o tsukaimasu.', pt: 'Uso a mesa.' }
  ]},
  toilet: { jp: 'トイレ', kana: 'といれ', romaji: 'toire', pt: 'vaso sanitário/banheiro' },
  tv: { jp: 'テレビ', kana: 'てれび', romaji: 'terebi', pt: 'televisão', actions: [
    { jp: 'テレビを見ます。', romaji: 'Terebi o mimasu.', pt: 'Assisto televisão.' }
  ]},
  laptop: { jp: 'ノートパソコン', kana: 'のーとぱそこん', romaji: 'nōto pasokon', pt: 'notebook', actions: [
    { jp: 'ノートパソコンを使います。', romaji: 'Nōto pasokon o tsukaimasu.', pt: 'Uso o notebook.' }
  ]},
  mouse: { jp: 'マウス', kana: 'まうす', romaji: 'mausu', pt: 'mouse', actions: [
    { jp: 'マウスを使います。', romaji: 'Mausu o tsukaimasu.', pt: 'Uso o mouse.' }
  ]},
  remote: { jp: 'リモコン', kana: 'りもこん', romaji: 'rimokon', pt: 'controle remoto', actions: [
    { jp: 'リモコンを使います。', romaji: 'Rimokon o tsukaimasu.', pt: 'Uso o controle remoto.' }
  ]},
  keyboard: { jp: 'キーボード', kana: 'きーぼーど', romaji: 'kībōdo', pt: 'teclado', actions: [
    { jp: 'キーボードを使います。', romaji: 'Kībōdo o tsukaimasu.', pt: 'Uso o teclado.' }
  ]},
  'cell phone': { jp: 'スマホ', kana: 'すまほ', romaji: 'sumaho', pt: 'celular', actions: [
    { jp: 'スマホを使います。', romaji: 'Sumaho o tsukaimasu.', pt: 'Uso o celular.' },
    { jp: 'スマホを取ります。', romaji: 'Sumaho o torimasu.', pt: 'Pego o celular.' }
  ]},
  microwave: { jp: '電子レンジ', kana: 'でんしれんじ', romaji: 'denshi renji', pt: 'micro-ondas', actions: [
    { jp: '電子レンジを使います。', romaji: 'Denshi renji o tsukaimasu.', pt: 'Uso o micro-ondas.' }
  ]},
  oven: { jp: 'オーブン', kana: 'おーぶん', romaji: 'ōbun', pt: 'forno', actions: [
    { jp: 'オーブンを使います。', romaji: 'Ōbun o tsukaimasu.', pt: 'Uso o forno.' }
  ]},
  toaster: { jp: 'トースター', kana: 'とーすたー', romaji: 'tōsutā', pt: 'torradeira', actions: [
    { jp: 'トースターを使います。', romaji: 'Tōsutā o tsukaimasu.', pt: 'Uso a torradeira.' }
  ]},
  sink: { jp: 'シンク', kana: 'しんく', romaji: 'shinku', pt: 'pia', actions: [
    { jp: 'シンクを使います。', romaji: 'Shinku o tsukaimasu.', pt: 'Uso a pia.' }
  ]},
  refrigerator: { jp: '冷蔵庫', kana: 'れいぞうこ', romaji: 'reizōko', pt: 'geladeira', actions: [
    { jp: '冷蔵庫を開けます。', romaji: 'Reizōko o akemasu.', pt: 'Abro a geladeira.' }
  ]},
  book: { jp: '本', kana: 'ほん', romaji: 'hon', pt: 'livro', actions: [
    { jp: '本を読みます。', romaji: 'Hon o yomimasu.', pt: 'Leio o livro.' }
  ]},
  clock: { jp: '時計', kana: 'とけい', romaji: 'tokei', pt: 'relógio', actions: [
    { jp: '時計を見ます。', romaji: 'Tokei o mimasu.', pt: 'Olho o relógio.' }
  ]},
  vase: { jp: '花瓶', kana: 'かびん', romaji: 'kabin', pt: 'vaso', actions: [
    { jp: '花瓶を見ます。', romaji: 'Kabin o mimasu.', pt: 'Olho para o vaso.' }
  ]},
  scissors: { jp: 'はさみ', kana: 'はさみ', romaji: 'hasami', pt: 'tesoura', actions: [
    { jp: 'はさみを使います。', romaji: 'Hasami o tsukaimasu.', pt: 'Uso a tesoura.' }
  ]},
  'teddy bear': { jp: 'テディベア', kana: 'てでぃべあ', romaji: 'tedi bea', pt: 'ursinho de pelúcia' },
  'hair drier': { jp: 'ドライヤー', kana: 'どらいやー', romaji: 'doraiyā', pt: 'secador de cabelo', actions: [
    { jp: 'ドライヤーを使います。', romaji: 'Doraiyā o tsukaimasu.', pt: 'Uso o secador.' }
  ]},
  toothbrush: { jp: '歯ブラシ', kana: 'はぶらし', romaji: 'haburashi', pt: 'escova de dentes', actions: [
    { jp: '歯ブラシを使います。', romaji: 'Haburashi o tsukaimasu.', pt: 'Uso a escova de dentes.' },
    { jp: '歯を磨きます。', romaji: 'Ha o migakimasu.', pt: 'Escovo os dentes.' }
  ]}
};


// Vocabulário manual adicional da V0.1. Estes itens enriquecem o estudo mesmo
// quando o detector COCO-SSD não possui uma classe visual correspondente.
Object.assign(JAPANESE_DB, {
  utility_knife: { jp: 'カッターナイフ', kana: 'かったーないふ', romaji: 'kattā naifu', pt: 'estilete / cortador', manualOnly: true, actions: [
    { jp: 'カッターナイフを使います。', romaji: 'Kattā naifu o tsukaimasu.', pt: 'Uso o estilete.' },
    { jp: 'カッターナイフを置きます。', romaji: 'Kattā naifu o okimasu.', pt: 'Coloco o estilete.' }
  ]},
  box: { jp: '箱', kana: 'はこ', romaji: 'hako', pt: 'caixa', manualOnly: true, actions: [
    { jp: '箱を開けます。', romaji: 'Hako o akemasu.', pt: 'Abro a caixa.' },
    { jp: '箱を持ちます。', romaji: 'Hako o mochimasu.', pt: 'Seguro/carrego a caixa.' }
  ]},
  cardboard_box: { jp: '段ボール箱', kana: 'だんぼーるばこ', romaji: 'danbōru bako', pt: 'caixa de papelão', manualOnly: true, actions: [
    { jp: '段ボール箱を開けます。', romaji: 'Danbōru bako o akemasu.', pt: 'Abro a caixa de papelão.' }
  ]},
  shelf: { jp: '棚', kana: 'たな', romaji: 'tana', pt: 'prateleira / estante', manualOnly: true },
  drawer: { jp: '引き出し', kana: 'ひきだし', romaji: 'hikidashi', pt: 'gaveta', manualOnly: true, actions: [
    { jp: '引き出しを開けます。', romaji: 'Hikidashi o akemasu.', pt: 'Abro a gaveta.' }
  ]},
  pen: { jp: 'ペン', kana: 'ぺん', romaji: 'pen', pt: 'caneta', manualOnly: true, actions: [
    { jp: 'ペンで書きます。', romaji: 'Pen de kakimasu.', pt: 'Escrevo com a caneta.' }
  ]},
  pencil: { jp: '鉛筆', kana: 'えんぴつ', romaji: 'enpitsu', pt: 'lápis', manualOnly: true, actions: [
    { jp: '鉛筆で書きます。', romaji: 'Enpitsu de kakimasu.', pt: 'Escrevo com o lápis.' }
  ]},
  paper: { jp: '紙', kana: 'かみ', romaji: 'kami', pt: 'papel', manualOnly: true },
  notebook_paper: { jp: 'ノート', kana: 'のーと', romaji: 'nōto', pt: 'caderno', manualOnly: true, actions: [
    { jp: 'ノートに書きます。', romaji: 'Nōto ni kakimasu.', pt: 'Escrevo no caderno.' }
  ]},
  key: { jp: '鍵', kana: 'かぎ', romaji: 'kagi', pt: 'chave', manualOnly: true, actions: [
    { jp: '鍵を取ります。', romaji: 'Kagi o torimasu.', pt: 'Pego a chave.' }
  ]},
  door: { jp: 'ドア', kana: 'どあ', romaji: 'doa', pt: 'porta', manualOnly: true, actions: [
    { jp: 'ドアを開けます。', romaji: 'Doa o akemasu.', pt: 'Abro a porta.' },
    { jp: 'ドアを閉めます。', romaji: 'Doa o shimemasu.', pt: 'Fecho a porta.' }
  ]},
  window: { jp: '窓', kana: 'まど', romaji: 'mado', pt: 'janela', manualOnly: true, actions: [
    { jp: '窓を開けます。', romaji: 'Mado o akemasu.', pt: 'Abro a janela.' }
  ]},
  wall: { jp: '壁', kana: 'かべ', romaji: 'kabe', pt: 'parede', manualOnly: true },
  floor: { jp: '床', kana: 'ゆか', romaji: 'yuka', pt: 'chão / piso', manualOnly: true },
  ceiling: { jp: '天井', kana: 'てんじょう', romaji: 'tenjō', pt: 'teto', manualOnly: true },
  bag: { jp: '袋', kana: 'ふくろ', romaji: 'fukuro', pt: 'sacola / saco', manualOnly: true },
  screwdriver: { jp: 'ドライバー', kana: 'どらいばー', romaji: 'doraibā', pt: 'chave de fenda', manualOnly: true, actions: [
    { jp: 'ドライバーを使います。', romaji: 'Doraibā o tsukaimasu.', pt: 'Uso a chave de fenda.' }
  ]},
  hammer: { jp: 'ハンマー', kana: 'はんまー', romaji: 'hanmā', pt: 'martelo', manualOnly: true },
  pliers: { jp: 'ペンチ', kana: 'ぺんち', romaji: 'penchi', pt: 'alicate', manualOnly: true },
  tape: { jp: 'テープ', kana: 'てーぷ', romaji: 'tēpu', pt: 'fita adesiva', manualOnly: true },
  ruler: { jp: '定規', kana: 'じょうぎ', romaji: 'jōgi', pt: 'régua', manualOnly: true },
  cable: { jp: 'ケーブル', kana: 'けーぶる', romaji: 'kēburu', pt: 'cabo', manualOnly: true },
  charger: { jp: '充電器', kana: 'じゅうでんき', romaji: 'jūdenki', pt: 'carregador', manualOnly: true, actions: [
    { jp: '充電器を使います。', romaji: 'Jūdenki o tsukaimasu.', pt: 'Uso o carregador.' }
  ]},
  lamp: { jp: '照明', kana: 'しょうめい', romaji: 'shōmei', pt: 'luminária / iluminação', manualOnly: true },
  glasses: { jp: '眼鏡', kana: 'めがね', romaji: 'megane', pt: 'óculos', manualOnly: true, actions: [
    { jp: '眼鏡をかけます。', romaji: 'Megane o kakemasu.', pt: 'Coloco/uso os óculos.' }
  ]}
});

const DEMONSTRATIVES = {
  kore: { thing: 'これ', romaji: 'kore', pt: 'isto', place: 'ここ', placeRomaji: 'koko', placePt: 'aqui' },
  sore: { thing: 'それ', romaji: 'sore', pt: 'isso', place: 'そこ', placeRomaji: 'soko', placePt: 'aí' },
  are:  { thing: 'あれ', romaji: 'are',  pt: 'aquilo', place: 'あそこ', placeRomaji: 'asoko', placePt: 'lá' }
};

function fallbackAction(item) {
  return {
    jp: `${item.jp}を見ます。`,
    romaji: `${capitalize(item.romaji)} o mimasu.`,
    pt: `Olho para: ${item.pt}.`
  };
}

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { JAPANESE_DB, DEMONSTRATIVES, fallbackAction, capitalize };
}

// V0.2 — objetos adicionados a partir dos testes físicos e da visão de vocabulário aberto.
Object.assign(JAPANESE_DB, {
  fan: { jp: '扇風機', kana: 'せんぷうき', romaji: 'senpūki', pt: 'ventilador', manualOnly: true, actions: [
    { jp: '扇風機をつけます。', romaji: 'Senpūki o tsukemasu.', pt: 'Ligo o ventilador.' },
    { jp: '扇風機を消します。', romaji: 'Senpūki o keshimasu.', pt: 'Desligo o ventilador.' }
  ]},
  hand: { jp: '手', kana: 'て', romaji: 'te', pt: 'mão', manualOnly: true, actions: [
    { jp: '手を上げます。', romaji: 'Te o agemasu.', pt: 'Levanto a mão.' },
    { jp: '手を洗います。', romaji: 'Te o araimasu.', pt: 'Lavo as mãos.' }
  ]},
  shoe: { jp: '靴', kana: 'くつ', romaji: 'kutsu', pt: 'sapato / calçado', manualOnly: true, actions: [
    { jp: '靴を履きます。', romaji: 'Kutsu o hakimasu.', pt: 'Calço o sapato.' },
    { jp: '靴を脱ぎます。', romaji: 'Kutsu o nugimasu.', pt: 'Tiro o sapato.' }
  ]}
});
