let arbSchedule = [];
let nodeMap = {};
let tierMap = {}; // ノード名 -> Tier名 のマッピング (例: "Munio": "A-Tier")

// 1. solNodes.json を取得
async function fetchNodeMap() {
  try {
    const response = await fetch(`./solNodes.json?t=${Date.now()}`);
    if (response.ok) {
      nodeMap = await response.json();
    }
  } catch (error) {
    console.warn('solNodes.json 取得エラー:', error);
  }
}

// 2. tier_data.txt を取得して解析
async function fetchTierData() {
  try {
    const response = await fetch(`./tier_data.txt?t=${Date.now()}`);
    if (!response.ok) return;

    const text = await response.text();
    const lines = text.trim().split('\n');

    lines.forEach(line => {
      // カンマまたはダブルクォーテーションで分離
      // 例: S-Tier,"Tyana Pass, Cytherean, Alator..."
      const firstCommaIndex = line.indexOf(',');
      if (firstCommaIndex === -1) return;

      const tier = line.substring(0, firstCommaIndex).trim(); // "S-Tier"
      let nodesString = line.substring(firstCommaIndex + 1).trim(); // '"Tyana Pass, Cytherean..."'

      // ダブルクォーテーションを除去
      nodesString = nodesString.replace(/^"+|"+$/g, '');

      // ノードリストを分解してマッピングに登録
      const nodeList = nodesString.split(',').map(n => n.trim());
      nodeList.forEach(nodeName => {
        if (nodeName) {
          tierMap[nodeName] = tier;
        }
      });
    });

    console.log('Tierデータの読み込み完了:', Object.keys(tierMap).length, '件');
  } catch (error) {
    console.warn('tier_data.txt 取得エラー:', error);
  }
}

// 3. ノード名とTierを組み合わせた表示名を取得
function getNodeName(nodeId) {
  if (!nodeId) return '--';

  // solNodes.json からミッション名（例: "Galatea (Neptune)"）を取得
  let baseName = nodeId;
  if (nodeMap[nodeId] && nodeMap[nodeId].value) {
    baseName = nodeMap[nodeId].value;
  }

  // tierMap に含まれるノード名が baseName 内に存在するか判定
  let matchedTier = null;
  for (const [nodeName, tier] of Object.entries(tierMap)) {
    // 例: "Galatea (Neptune)" が "Galatea" を含んでいるか確認
    if (baseName.includes(nodeName)) {
      matchedTier = tier;
      break;
    }
  }

  // Tierが見つかれば末尾に付与
  if (matchedTier) {
    return `${baseName} (${matchedTier})`;
  }

  return baseName;
}

// 4. arbys.txt の取得と解析
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

// 5. データ解析
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

// 6. 画面表示の更新
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

// 初期化
document.addEventListener('DOMContentLoaded', async () => {
  // マップデータとTierデータを並行して読み込み
  await Promise.all([fetchNodeMap(), fetchTierData()]);
  await fetchAndParseArbysData();

  setInterval(updateDisplay, 1000);
  setInterval(fetchAndParseArbysData, 600000);
});
