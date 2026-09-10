let arbSchedule = [];
let nodeMap = {}; // ノード辞書を保持するオブジェクト

// 1. ノードマップ（JSON）を取得する関数
async function fetchNodeMap() {
  try {
    const response = await fetch(`./solnodes.json?t=${Date.now()}`);
    if (response.ok) {
      nodeMap = await response.json();
      console.log('ノードマップの読み込み完了:', Object.keys(nodeMap).length, '件');
    }
  } catch (error) {
    console.warn('ノードマップの取得に失敗しました（IDをそのまま表示します）:', error);
  }
}

// 2. ノードIDを表示用の名称に変換するヘルパー関数
function getNodeName(nodeId) {
  if (!nodeId) return '--';
  // マップに定義があれば変換、なければノードIDをそのまま表示
  return nodeMap[nodeId] || nodeId;
}

// 3. arbys.txt を取得して解析する関数
async function fetchAndParseArbysData() {
  try {
    const response = await fetch(`./arbys.txt?t=${Date.now()}`);
    if (!response.ok) {
      throw new Error(`HTTPエラー: ${response.status}`);
    }

    const rawArbysData = await response.text();
    parseData(rawArbysData);

  } catch (error) {
    console.error('arbys.txt の取得に失敗しました:', error);
    document.getElementById('current-node').textContent = '取得エラー';
  }
}

// 4. テキストデータを解析する関数
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

  parsedItems.sort((a, b) => a.timestamp - b.timestamp);
  arbSchedule = parsedItems;

  updateDisplay();
}

// 5. 画面表示の更新処理
function updateDisplay() {
  if (arbSchedule.length === 0) return;

  const now = Math.floor(Date.now() / 1000);
  const currentHourStart = now - (now % 3600);

  let currentIndex = arbSchedule.findIndex(item => item.timestamp === currentHourStart);

  if (currentIndex === -1) {
    const baseTimestamp = arbSchedule[0].timestamp;
    const hoursPassed = Math.floor((currentHourStart - baseTimestamp) / 3600);
    const totalItems = arbSchedule.length;
    currentIndex = ((hoursPassed % totalItems) + totalItems) % totalItems;
  }

  const currentArb = arbSchedule[currentIndex];
  const nextArb = arbSchedule[(currentIndex + 1) % arbSchedule.length];

  if (currentArb) {
    // getNodeName() を通してミッション名に変換して表示
    document.getElementById('current-node').textContent = getNodeName(currentArb.node);
    document.getElementById('next-node').textContent = nextArb ? getNodeName(nextArb.node) : '--';

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

// 初期化処理
document.addEventListener('DOMContentLoaded', async () => {
  // まずノードマップを読み込み
  await fetchNodeMap();

  // その後でスケジュールデータを取得
  await fetchAndParseArbysData();

  // 1秒ごとにタイマー表示更新
  setInterval(updateDisplay, 1000);

  // 10分ごとに arbys.txt を再取得
  setInterval(fetchAndParseArbysData, 600000);
});
