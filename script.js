let arbSchedule = [];

// 1. arbys.txt を取得して解析する関数
async function fetchAndParseArbysData() {
  try {
    // キャッシュ対策としてタイムスタンプを付与して常に最新データを取得
    const response = await fetch(`./arbys.txt?t=${Date.now()}`);
    
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const rawArbysData = await response.text();
    parseData(rawArbysData);

  } catch (error) {
    console.error('arbys.txt の取得に失敗しました:', error);
    document.getElementById('current-node').textContent = 'データ読み込みエラー';
  }
}

// 2. テキストデータを解析する関数
function parseData(textData) {
  const lines = textData.trim().split('\n');

  const parsedItems = lines.map(line => {
    const parts = line.trim().split(/[, \t]+/);
    const timestamp = parseInt(parts[0], 10);
    const node = parts.slice(1).join(' ');
    return { timestamp, node };
  }).filter(item => !isNaN(item.timestamp) && item.node);

  if (parsedItems.length === 0) {
    document.getElementById('current-node').textContent = 'データ未設定';
    return;
  }

  // タイムスタンプ昇順にソート
  parsedItems.sort((a, b) => a.timestamp - b.timestamp);
  arbSchedule = parsedItems;

  updateDisplay();
}

// 3. 画面表示の更新処理
function updateDisplay() {
  if (arbSchedule.length === 0) {
    document.getElementById('current-node').textContent = 'データ未設定';
    document.getElementById('next-node').textContent = '--';
    document.getElementById('timer').textContent = '--:--';
    return;
  }

  const now = Math.floor(Date.now() / 1000);
  
  // 現在時刻の毎時0分のタイムスタンプ
  const currentHourStart = now - (now % 3600);

  // 1. タイムスタンプが一致するデータを検索
  let currentIndex = arbSchedule.findIndex(item => item.timestamp === currentHourStart);

  // 2. 一致するものがない場合、先頭データからの経過時間（時間単位）でインデックスを計算
  if (currentIndex === -1) {
    const baseTimestamp = arbSchedule[0].timestamp;
    const hoursPassed = Math.floor((currentHourStart - baseTimestamp) / 3600);
    currentIndex = ((hoursPassed % arbSchedule.length) + arbSchedule.length) % arbSchedule.length;
  }

  if (currentIndex !== -1 && arbSchedule[currentIndex]) {
    const currentArb = arbSchedule[currentIndex];
    const nextArb = arbSchedule[(currentIndex + 1) % arbSchedule.length];

    document.getElementById('current-node').textContent = currentArb.node;
    document.getElementById('next-node').textContent = nextArb ? nextArb.node : '--';

    // 次の毎時0分00秒までの残り秒数
    const remainingSeconds = 3600 - (now % 3600);
    const mins = String(Math.floor(remainingSeconds / 60)).padStart(2, '0');
    const secs = String(remainingSeconds % 60).padStart(2, '0');

    document.getElementById('timer').textContent = `${mins}:${secs}`;
  } else {
    document.getElementById('current-node').textContent = '該当データなし';
    document.getElementById('next-node').textContent = '--';
    document.getElementById('timer').textContent = '--:--';
  }
}

// 初期実行（テキストファイルを取得）
fetchAndParseArbysData();

// タイマー更新（1秒ごと）
setInterval(updateDisplay, 1000);

// ファイルの自動再読み込み（例: 1時間ごとにテキストを再取得したい場合）
setInterval(fetchAndParseArbysData, 3600000);
