let arbSchedule = [];
let nodeMap = {};

// 1. solNodes.json を取得する関数
async function fetchNodeMap() {
  console.log('1. solNodes.json の取得を開始します...');
  try {
    const response = await fetch(`./solNodes.json?t=${Date.now()}`);
    console.log('solNodes.json レスポンスステータス:', response.status);

    if (response.ok) {
      nodeMap = await response.json();
      console.log('2. solNodes.json の読み込み成功:', Object.keys(nodeMap).length, '件のノードデータ');
    } else {
      console.warn('solNodes.json が見つかりませんでした (HTTP ' + response.status + ')');
    }
  } catch (error) {
    console.error('solNodes.json 取得時の通信エラー:', error);
  }
}

// 2. ノード名（value）を取り出す処理
function getNodeName(nodeId) {
  if (!nodeId) return '--';
  
  // nodeMap[nodeId] が存在し、その中に value プロパティがあれば返す
  if (nodeMap[nodeId] && nodeMap[nodeId].value) {
    return nodeMap[nodeId].value;
  }
  
  // なければ ID そのものを返す
  return nodeId;
}

// 3. arbys.txt を取得して解析する関数
async function fetchAndParseArbysData() {
  console.log('3. arbys.txt の取得を開始します...');
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
  console.log('プログラムを開始します...');
  await fetchNodeMap();
  await fetchAndParseArbysData();

  setInterval(updateDisplay, 1000);
  setInterval(fetchAndParseArbysData, 600000);
});
