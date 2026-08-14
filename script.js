/* ============================================================
   GOLDEN ROAD · VALORANT — 交互脚本
   1. 模式选择（单选切换 + 底部按钮文字联动）
   2. 完整规则弹窗（打开 / 关闭 / Esc / 遮罩点击）
   3. 主按钮入场反馈
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 1. 模式选择 ---------- */
  var cards = Array.prototype.slice.call(document.querySelectorAll('.mode-card:not(.disabled)'));
  var ctaText = document.getElementById('cta-text');
  var ctaBtn = document.getElementById('cta-btn');
  var rulesTitle = document.getElementById('rules-title');
  var rulesDesc = document.getElementById('rules-desc');

  var CTA_PREFIX = {
    ascension: '开始成神试炼',
    agent: '开始圆梦模式',
    classic: '开始经典模式',
    ranked: '开始大核模式'
  };

  /* 规则提示条文字（随模式切换） */
  var RULES_BAR = {
    ascension: { title: '九冠王者 巅峰连战', desc: '集结强者，让阵容所向披靡' },
    agent: { title: '选定一位无冠军赛冠军传奇', desc: '为他重组阵容,亲手补上最后一冠' },
    classic: { title: '五次召唤凑齐传奇五人组', desc: '六大赛事连战,看看你能带走几冠' },
    ranked: { title: '围绕王牌打完整个赛季', desc: '赢下宿敌,冲击属于你的六冠传奇' }
  };

  /* 淡出 → 换字 → 淡入 的切换动效 */
  function swapText(el, nextText, callback) {
    if (el.textContent === nextText) {
      if (callback) callback();
      return;
    }
    el.style.transition = 'transform .15s ease, opacity .15s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    window.setTimeout(function () {
      el.textContent = nextText;
      el.style.opacity = '1';
      el.style.transform = 'none';
      if (callback) callback();
    }, 150);
  }

  function selectCard(card) {
    cards.forEach(function (c) { c.classList.remove('selected'); });
    card.classList.add('selected');

    var mode = card.getAttribute('data-mode');
    var nextText = CTA_PREFIX[mode] || CTA_PREFIX.ascension;
    var bar = RULES_BAR[mode] || RULES_BAR.ascension;

    swapText(ctaText, nextText);
    swapText(rulesTitle, bar.title);
    swapText(rulesDesc, bar.desc);
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      selectCard(card);
    });
  });

  /* ---------- 2. 规则弹窗（第 3 条规则随所选模式切换） ---------- */
  var overlay = document.getElementById('modal-overlay');
  var rulesBtn = document.getElementById('rules-btn');
  var closeBtn = document.getElementById('modal-close');
  var confirmBtns = Array.prototype.slice.call(document.querySelectorAll('[data-confirm]'));
  var modalEyebrow = document.getElementById('modal-eyebrow');
  var ruleThree = document.getElementById('rule-three');

  /* 各模式第 3 条规则 + 眉标 */
  var MODE_EYEBROW = {
    ascension: 'GOLDEN ROAD · ASCENSION',
    agent: 'GOLDEN ROAD · DREAM',
    classic: 'GOLDEN ROAD · CLASSIC',
    ranked: 'GOLDEN ROAD · CORE'
  };

  var RULE_THREE = {
    /* 成神试炼 */
    ascension: '5 次召唤完成初始阵容，逐层挑战<span class="rule-em">九层冠军 Boss</span>。获胜后可招降选手、觉醒选手或保留原阵继续闯关；前七层战败，可触发「<span class="rule-em">地狱归来</span>」，强化状态重新挑战当前 Boss。',
    /* 特工征召（圆梦模式） */
    agent: '先从<span class="rule-em">九位候选人</span>中选定一名职业生涯无S冠的<span class="rule-em">圆梦主角</span>，再为他召唤四名队友。只要未能夺得<span class="rule-em">S赛冠军</span>，就能保留主角直接<span class="rule-em">重选四名队友</span>，继续冲冠。',
    /* 经典模式 */
    classic: '五人满编后<span class="rule-em">直接结算</span>启点赛、大师赛、第一赛段、大师赛、第二赛段与全球冠军赛；没有核心任命、宿敌战和赛中决策，保留<span class="rule-em">1.0的纯阵容幻想体验</span>。',
    /* 排位冲分（大核模式） */
    ranked: '五人满编后先<span class="rule-em">任命全年核心</span>，再依次征战启点赛、大师赛、第一赛段、大师赛、第二赛段与全球冠军赛；<span class="rule-em">年度宿敌</span>会自动推荐 <span class="rule-em">BO5</span>，3:2 后可坚持或换核<span class="rule-em">时空回溯</span>；即使金光大道中断，全年六站站仍会<span class="rule-em">完整结算</span>'
  };

  /* 按当前选中模式渲染第 3 条规则 */
  function renderRules() {
    var selected = document.querySelector('.mode-card.selected');
    var mode = selected ? selected.getAttribute('data-mode') : 'ascension';

    ruleThree.innerHTML = RULE_THREE[mode] || RULE_THREE.ascension;
    modalEyebrow.textContent = MODE_EYEBROW[mode] || MODE_EYEBROW.ascension;
  }

  function openModal() {
    renderRules();
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  rulesBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  confirmBtns.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });

  // 点击遮罩空白处关闭
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Esc 关闭（优先 Boss 连战，其次召唤流程，再规则弹窗）
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (bossOverlay && bossOverlay.classList.contains('open')) {
        closeBossFlow();
      } else if (summonOverlay && summonOverlay.classList.contains('open')) {
        closeFlow();
      } else if (overlay.classList.contains('open')) {
        closeModal();
      }
    }
  });

  /* ---------- 3. 主按钮反馈 / 进入成神召唤流程 ---------- */
  ctaBtn.addEventListener('click', function () {
    var selected = document.querySelector('.mode-card.selected');
    var mode = selected ? selected.getAttribute('data-mode') : 'ascension';

    if (mode === 'ascension') {
      // 成神试炼：打开召唤流程
      openFlow();
      return;
    }

    // 其他模式：触发出征闪光动画
    ctaBtn.classList.remove('launch');
    void ctaBtn.offsetWidth; // 强制重排以重新触发动画
    ctaBtn.classList.add('launch');

    var modeName = selected ? selected.getAttribute('data-name') : '成神试炼';
    console.log('[GOLDEN ROAD] 出征:', modeName);
  });

  /* 出征闪光动画（由 JS 触发一次） */
  ctaBtn.addEventListener('animationend', function () {
    ctaBtn.classList.remove('launch');
  });

  /* ---------- 4. 成神试炼：召唤流程（5 次召唤） ---------- */
  var summonOverlay = document.getElementById('summon-overlay');
  var summonTitle = document.getElementById('summon-title');
  var summonRound = document.getElementById('summon-round');
  var riftResult = document.getElementById('rift-result');
  var riftHint = document.getElementById('rift-hint');
  var summonCta = document.getElementById('summon-cta');
  var rosterPanel = document.getElementById('roster-panel');
  var rosterTitle = document.getElementById('roster-title');
  var rosterList = document.getElementById('roster-list');
  var rerollYearBtn = document.getElementById('reroll-year');
  var rerollTeamBtn = document.getElementById('reroll-team');
  var summonExit = document.getElementById('summon-exit');
  var roleSlots = Array.prototype.slice.call(document.querySelectorAll('.role-slot'));

  /* 战队池：仅从 players.json 加载，脚本内不内置任何选手数据 */
  var TEAM_POOL = [];
  var TEAMS_BY_YEAR = {}; // 按赛事年份分组索引，供「同年换队」使用

  /* 冠军数据（来自 champions.json） */
  var CHAMPION_TEAMS = [];
  var CHAMPION_PLAYERS = [];
  var BOSS_POOL = []; // 全部冠军 Boss 池
  var BOSSES = [];    // 本局随机抽出的 9 层 Boss（按总分递增）

  /* 每次开局：从冠军池随机抽 9 位，按总分从低到高排，
     确保后面一层比前面一层分数高 */
  function buildBosses() {
    var pool = BOSS_POOL.slice();
    while (pool.length > 9) {
      pool.splice(Math.floor(Math.random() * pool.length), 1);
    }
    pool.sort(function (a, b) {
      var d = sumScore(a.players) - sumScore(b.players);
      // 同分并列时随机先后,其余严格按总分递增
      if (d === 0) return Math.random() < 0.5 ? -1 : 1;
      return d;
    });
    BOSSES = pool.map(function (b, i) {
      return {
        floor: i + 1,
        year: b.year,
        event: b.event,
        team: b.team,
        title: b.title,
        desc: b.desc,
        players: b.players
      };
    });
  }

  /* 数据加载：两个 JSON 文件通过 <script> 标签引入并挂载到 window，
     这里直接读取全局变量即可——http:// 和 file:// 双击打开均可使用。 */
  (function loadData() {
    function toPlayers(list) {
      return (list || []).map(function (p) {
        return { name: p.name, score: Number(p.score) || 0 };
      });
    }

    function addTeam(year, tm) {
      var players = toPlayers(tm.players);
      // 队内名次:按分数降序(同分按原顺序),第 5 名及以后一律记为 5
      players
        .map(function (p, i) { return { p: p, i: i }; })
        .sort(function (a, b) { return b.p.score - a.p.score || a.i - b.i; })
        .forEach(function (o, idx) { o.p.rank = Math.min(idx + 1, 5); });
      var team = { year: year, event: tm.event || '', team: tm.team, players: players };
      TEAM_POOL.push(team);
      TEAMS_BY_YEAR[year] = TEAMS_BY_YEAR[year] || [];
      TEAMS_BY_YEAR[year].push(team);
    }

    var playersData = window.GOLDEN_ROAD_PLAYERS;
    if (playersData) {
      // 新结构：按年份分组 tournaments[{ year, teams[] }]
      if (Array.isArray(playersData.tournaments) && playersData.tournaments.length) {
        playersData.tournaments.forEach(function (tour) {
          (tour.teams || []).forEach(function (tm) { addTeam(tour.year, tm); });
        });
      } else if (Array.isArray(playersData.teams) && playersData.teams.length) {
        // 兼容旧结构：teams[] 自带 year
        playersData.teams.forEach(function (tm) { addTeam(tm.year, tm); });
      }
    }

    if (TEAM_POOL.length) {
      console.log('[GOLDEN ROAD] 已加载战队数据:', TEAM_POOL.length, '支,年份分组:', Object.keys(TEAMS_BY_YEAR).join(' / '));
    } else {
      console.warn('[GOLDEN ROAD] players.json 缺失或格式错误');
    }

    var championsData = window.GOLDEN_ROAD_CHAMPIONS;
    if (championsData) {
      CHAMPION_TEAMS = Array.isArray(championsData.championTeams) ? championsData.championTeams : [];
      CHAMPION_PLAYERS = Array.isArray(championsData.championPlayers) ? championsData.championPlayers : [];
      BOSS_POOL = Array.isArray(championsData.bosses)
        ? championsData.bosses.map(function (b) {
            var players = toPlayers(b.players);
            // Boss 队内名次:按分数降序,第 5 名及以后记为 5
            players
              .map(function (p, i) { return { p: p, i: i }; })
              .sort(function (a, b2) { return b2.p.score - a.p.score || a.i - b2.i; })
              .forEach(function (o, idx) { o.p.rank = Math.min(idx + 1, 5); });
            return {
              year: b.year,
              event: b.event || '',
              team: b.team,
              title: b.title || '王座',
              desc: b.desc || '',
              players: players
            };
          })
        : [];
      buildBosses();
      console.log('[GOLDEN ROAD] 已加载冠军数据:', CHAMPION_TEAMS.length, '支冠军战队,冠军池', BOSS_POOL.length, '位,本局 Boss', BOSSES.length, '层');
    }
  })();

  var TOTAL_ROUNDS = 5;
  var flow = {
    round: 1,
    phase: 'summon',   // summon | lock | done
    current: null,     // 当前裂隙降落的战队（待锁定）
    drawnKeys: [],     // 已完成召唤的 年份 战队 键
    locked: [],        // 已锁定选手 [{name, team, year, rank}]
    usedRanks: [],     // 已用过的队内名次（1-5 各限一次）
    lastOrder: [],     // 上一轮名单展示顺序（保证每轮排序不同）
    rerollYear: 1,
    rerollTeam: 1
  };

  function teamKey(t) { return t.year + '|' + (t.event || '') + '|' + t.team; }
  function evLabel(t) { return t.event || t.year; }
  function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  /* Fisher-Yates 洗牌(不改变原数组) */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  /* 名单洗牌:保证与上一次展示的顺序不同 */
  function shuffledPlayers(players) {
    var list = shuffle(players);
    if (players.length > 1) {
      var lastNames = flow.lastOrder.join('|');
      var tries = 0;
      while (tries < 8 && list.map(function (p) { return p.name; }).join('|') === lastNames) {
        list = shuffle(players);
        tries++;
      }
    }
    flow.lastOrder = list.map(function (p) { return p.name; });
    return list;
  }

  function isNameLocked(name) {
    return flow.locked.some(function (p) { return p.name === name; });
  }

  function isRankUsed(rank) {
    return flow.usedRanks.indexOf(rank) !== -1;
  }

  /* 可锁定的选手:未签下 且 队内名次为 1-5 且该名次未用过 */
  function lockableOf(t) {
    return t.players.filter(function (p) {
      return !isNameLocked(p.name) && p.rank >= 1 && p.rank <= 5 && !isRankUsed(p.rank);
    });
  }

  /* 候选战队：未召唤过 且 有可锁定选手 */
  function availableTeams(excludeKey) {
    var avail = TEAM_POOL.filter(function (t) {
      var key = teamKey(t);
      if (key === excludeKey) return false;
      if (flow.drawnKeys.indexOf(key) !== -1) return false;
      return lockableOf(t).length > 0;
    });
    if (avail.length > 0) return avail;
    // 兜底：未召唤过的战队即可
    return TEAM_POOL.filter(function (t) {
      var key = teamKey(t);
      return key !== excludeKey && flow.drawnKeys.indexOf(key) === -1;
    });
  }

  function drawTeam() {
    if (TEAM_POOL.length === 0) return false;
    flow.current = randPick(availableTeams(null));
    return true;
  }

  /* 同年换队：同年重抽一支战队（直接用年份分组索引） */
  function rerollSameYear() {
    if (!flow.current || flow.rerollYear <= 0) return;
    var year = flow.current.year;
    var currentKey = teamKey(flow.current);
    var sameYear = (TEAMS_BY_YEAR[year] || []).filter(function (t) {
      var key = teamKey(t);
      return key !== currentKey && flow.drawnKeys.indexOf(key) === -1 && lockableOf(t).length > 0;
    });
    var pool = sameYear.length > 0 ? sameYear : availableTeams(currentKey);
    flow.current = randPick(pool);
    flow.rerollYear--;
    riftResult.textContent = evLabel(flow.current) + ' • ' + flow.current.team;
    renderRerollBtns();
    renderRoster();
  }

  /* 同队换年：同队回溯到另一个年份 */
  function rerollSameTeam() {
    if (!flow.current || flow.rerollTeam <= 0) return;
    var sameTeam = availableTeams(teamKey(flow.current)).filter(function (t) {
      return t.team === flow.current.team;
    });
    var pool = sameTeam.length > 0 ? sameTeam : availableTeams(teamKey(flow.current));
    flow.current = randPick(pool);
    flow.rerollTeam--;
    riftResult.textContent = evLabel(flow.current) + ' • ' + flow.current.team;
    renderRerollBtns();
    renderRoster();
  }

  function renderRerollBtns() {
    rerollYearBtn.textContent = '同年换队 ×' + flow.rerollYear;
    rerollTeamBtn.textContent = '同队换年 ×' + flow.rerollTeam;
    var inLock = flow.phase === 'lock' && flow.current;
    rerollYearBtn.disabled = !(inLock && flow.rerollYear > 0);
    rerollTeamBtn.disabled = !(inLock && flow.rerollTeam > 0);
  }

  /* 五个槽位：清空 → 按顺序填入已锁定选手 */
  function renderRoleSlots() {
    roleSlots.forEach(function (slot, i) {
      var hexText = slot.querySelector('.role-hex-text');
      var status = slot.querySelector('.role-status');
      var player = flow.locked[i] || null;
      if (player) {
        slot.classList.add('locked');
        hexText.textContent = player.name;
        status.textContent = player.team + ' · ' + (player.event || player.year);
      } else {
        slot.classList.remove('locked');
        hexText.textContent = String(i + 1);
        status.textContent = '待召唤';
      }
    });
  }

  /* 锁定阶段名单 */
  function renderRoster() {
    if (!flow.current) return;
    rosterTitle.textContent = evLabel(flow.current) + ' ' + flow.current.team + ' 名单';

    /* 选手顺序打乱,且每次选择展示顺序都不同 */
    var list = shuffledPlayers(flow.current.players);
    var items = list.map(function (p, i) {
      var nameLocked = isNameLocked(p.name);
      var rankUsed = !nameLocked && isRankUsed(p.rank);
      var disabled = nameLocked || rankUsed;
      var note = nameLocked ? '已锁定' : (rankUsed ? '该名次已选' : '');
      return '<li style="--i:' + i + '">' +
        '<button class="roster-item" type="button" data-name="' + p.name + '"' + (disabled ? ' disabled' : '') + '>' +
        '<span class="player-badge">' + flow.current.team + '</span>' +
        '<span class="player-name">' + p.name + '</span>' +
        (note ? '<span class="player-note">' + note + '</span>' : '') +
        '<span class="player-rank">队内#' + p.rank + '</span>' +
        '<span class="player-year">' + evLabel(flow.current) + '</span>' +
        '</button></li>';
    });
    rosterList.innerHTML = items.join('');
  }

  /* 阶段渲染 */
  function renderPhase() {
    if (flow.phase === 'summon') {
      var noData = TEAM_POOL.length === 0;
      summonTitle.textContent = '正在召唤';
      summonRound.textContent = '第' + flow.round + '/' + TOTAL_ROUNDS + '次召唤';
      riftResult.textContent = noData ? '数据缺失' : '?? • ???';
      riftHint.textContent = noData ? '未加载到 players.json，请检查数据文件是否完整' : '点击下方按钮，召唤一支战队';
      summonCta.textContent = '召唤';
      summonCta.disabled = noData;
      rosterPanel.hidden = true;
    } else if (flow.phase === 'lock') {
      summonTitle.textContent = '请锁定选手';
      summonRound.textContent = '第' + flow.round + '/' + TOTAL_ROUNDS + '次召唤';
      riftResult.textContent = evLabel(flow.current) + ' • ' + flow.current.team;
      riftHint.textContent = '只能锁定队内第 1-5 名，且名次不可重复';
      summonCta.textContent = '点击锁定';
      summonCta.disabled = true;
      rosterPanel.hidden = false;
      renderRoster();
    } else if (flow.phase === 'done') {
      summonTitle.textContent = '召唤完成';
      summonRound.textContent = '5/5 次召唤完成';
      riftResult.textContent = '成神阵容已就绪';
      riftHint.textContent = '点击下方按钮，开始九层冠军 Boss 连战';
      summonCta.textContent = '开始征程';
      summonCta.disabled = false;
      rosterPanel.hidden = true;
    }
    renderRerollBtns();
  }

  function openFlow() {
    flow.round = 1;
    flow.phase = 'summon';
    flow.current = null;
    flow.drawnKeys = [];
    flow.locked = [];
    flow.usedRanks = [];
    flow.lastOrder = [];
    flow.rerollYear = 1;
    flow.rerollTeam = 1;
    renderRoleSlots();
    renderPhase();
    summonOverlay.classList.add('open');
    summonOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeFlow() {
    summonOverlay.classList.remove('open');
    summonOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* 锁定选手：入队 → 下一轮或完成 */
  function lockPlayer(name) {
    if (!flow.current) return;
    var player = null;
    flow.current.players.some(function (p) {
      if (p.name === name) { player = p; return true; }
      return false;
    });
    if (!player) return;
    // 名次规则:仅 1-5 名 且 该名次未被使用
    if (player.rank < 1 || player.rank > 5 || isRankUsed(player.rank) || isNameLocked(player.name)) return;
    flow.locked.push({
      name: player.name,
      score: player.score,
      team: flow.current.team,
      year: flow.current.year,
      event: flow.current.event || flow.current.year,
      rank: player.rank
    });
    flow.usedRanks.push(player.rank);
    flow.drawnKeys.push(teamKey(flow.current));
    flow.current = null;
    renderRoleSlots();

    flow.round++;
    flow.phase = flow.round > TOTAL_ROUNDS ? 'done' : 'summon';
    renderPhase();
  }

  /* 主按钮：召唤 / 开始征程 */
  summonCta.addEventListener('click', function () {
    if (flow.phase === 'summon') {
      if (!drawTeam()) return;
      flow.phase = 'lock';
      renderPhase();
    } else if (flow.phase === 'done') {
      closeFlow();
      console.log('[GOLDEN ROAD] 成神阵容:', flow.locked.map(function (p) { return p.name; }).join(' / '));
      openBossFlow();
    }
  });

  /* 名单点击锁定（事件委托） */
  rosterList.addEventListener('click', function (e) {
    var item = e.target.closest ? e.target.closest('.roster-item') : null;
    if (!item || item.disabled) return;
    lockPlayer(item.getAttribute('data-name'));
  });

  rerollYearBtn.addEventListener('click', rerollSameYear);
  rerollTeamBtn.addEventListener('click', rerollSameTeam);
  summonExit.addEventListener('click', closeFlow);

  /* ---------- 5. 九层 Boss 连战 ---------- */
  var bossOverlay = document.getElementById('boss-overlay');
  var bossBody = document.getElementById('boss-body');

  var bossState = {
    floor: 1,        // 当前层 1..9
    myTeam: [],      // [{name, score, team, year}]（可被招降/觉醒/刻印改变）
    lifeUsed: false, // 第二命令是否已用
    clears: 0,       // 已击破层数
    marks: 0,        // 道路刻印（延续打法次数）
    result: null,    // 本层战果 {win, myScore, bossScore}
    history: []      // 每层战果 [{floor, title, team, event, win, myScore, bossScore}]
  };

  function sumScore(team) {
    return team.reduce(function (s, p) { return s + p.score; }, 0);
  }

  function currentBoss() {
    return BOSSES[bossState.floor - 1];
  }

  function exitBtnHtml() {
    return '<button class="summon-exit" type="button" data-action="exit">〈 退出本局</button>';
  }

  /* 选手小卡片（不分位置，仅显示名字与来处、分数） */
  function miniListHtml(list, enemy) {
    return '<ul class="player-mini-list">' + list.map(function (p, i) {
      return '<li class="player-mini' + (enemy ? ' enemy' : '') + '" style="--i:' + i + '">' +
        '<span class="mini-badge">' + p.team + '</span>' +
        '<span class="mini-name">' + p.name + '</span>' +
        '<span class="mini-from">' + (p.event || p.year) + '</span>' +
        '<span class="mini-score">' + p.score + '</span>' +
        '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- 图一：本层守关 ---------- */
  function renderBossFloor() {
    var boss = currentBoss();

    /* champions.json 为空时的占位提示 */
    if (!boss) {
      bossBody.innerHTML =
        '<p class="boss-eyebrow" style="text-align:center;">ASCENSION • BOSS RUSH</p>' +
        '<div style="margin-top:40px;text-align:center;">' +
          '<h3 class="boss-title">Boss 数据待补充</h3>' +
          '<p class="boss-sub" style="margin-top:12px;">champions.json 暂为空，九层王座即将降临</p>' +
          '<button class="summon-cta" style="margin-top:24px;" type="button" data-action="exit">退出本局</button>' +
        '</div>';
      return;
    }

    var lifeText = bossState.lifeUsed ? '第二命令 • 本局已使用' : '第二命令 • 本局尚未使用';
    var lifeClass = bossState.lifeUsed ? 'boss-life-badge used' : 'boss-life-badge';
    var rosterTag = bossState.clears > 0
      ? '凡人之阵 • 已夺取 ' + bossState.clears + ' 层力量'
      : '凡人之阵 • 尚未夺取力量';
    if (bossState.marks > 0) rosterTag += ' • 道路刻印 ×' + bossState.marks;

    var dots = BOSSES.map(function (b, i) {
      var cls = 'floor-dot';
      if (i + 1 < bossState.floor) cls += ' cleared';
      else if (i + 1 === bossState.floor) cls += ' current';
      return '<span class="' + cls + '">' + (i + 1) + '</span>';
    }).join('');

    bossBody.innerHTML =
      '<p class="boss-eyebrow">ASCENSION • BOSS RUSH</p>' +
      '<span class="' + lifeClass + '">' + lifeText + '</span>' +
      '<h3 class="boss-title" id="boss-title">成神 • 第' + bossState.floor + '层</h3>' +
      '<p class="boss-sub">' + boss.title + ' • ' + (bossState.lifeUsed ? '第二条命已用' : '尚可用第二条命改写一次败局') + '</p>' +
      '<div class="floor-dots">' + dots + '</div>' +
      '<div class="boss-panel">' +
        '<div class="boss-panel-head"><h4>' + rosterTag + '</h4><span class="panel-tag">总分 ' + sumScore(bossState.myTeam) + '</span></div>' +
        miniListHtml(bossState.myTeam, false) +
      '</div>' +
      '<div class="boss-panel">' +
        '<div class="boss-panel-head"><h4>FLOOR ' + bossState.floor + ' • ' + boss.title + '</h4><span class="panel-tag">守关者总分 ' + sumScore(boss.players) + '</span></div>' +
        '<p class="vs-team" style="margin-top:8px;text-align:left;">' + (boss.event || boss.year) + ' ' + boss.team + '</p>' +
        miniListHtml(boss.players.map(function (p) {
          return { name: p.name, score: p.score, team: boss.team, year: boss.year, event: boss.event };
        }), true) +
        '<p class="fight-flavor" style="text-align:left;margin-top:10px;">' + boss.desc + '</p>' +
      '</div>' +
      '<div class="boss-challenge">' +
        '<button class="summon-cta" type="button" data-action="challenge">挑战本层 BOSS</button>' +
        '<p class="boss-note">胜负将在阵容、成长与临场波动中决定</p>' +
      '</div>' +
      exitBtnHtml();
  }

  /* 战斗判定：总分之和高者胜，胜方 3 分，败方随机 0-2 分 */
  function startFight() {
    var boss = currentBoss();
    if (!boss) return;
    var win = sumScore(bossState.myTeam) > sumScore(boss.players);
    var loserScore = Math.floor(Math.random() * 3); // 0 / 1 / 2
    var result = {
      win: win,
      myScore: win ? 3 : loserScore,
      bossScore: win ? loserScore : 3
    };
    bossState.result = result;
    /* 记录每层战果（第二条命重战则覆盖本层） */
    bossState.history = bossState.history.filter(function (h) { return h.floor !== bossState.floor; });
    bossState.history.push({
      floor: bossState.floor,
      title: boss.title,
      team: boss.team,
      event: boss.event || boss.year,
      win: result.win,
      myScore: result.myScore,
      bossScore: result.bossScore
    });
    renderBossFight();
  }

  /* ---------- 图二：战斗结算 ---------- */
  function renderBossFight() {
    var boss = currentBoss();
    var r = bossState.result;

    var flavor = r.win
      ? '回合鸣响，双方列阵交火 —— 防守方连扳三局搅动胜负天平，志在封神的队伍却次次先控住下一处理想包点。当爆能器第三次轰然起爆，对手再也无力作出回应。'
      : '战铃响起，攻守对峙 —— 防守方布防滴水不漏，志在封神的队伍数次发起突破，尽数被扼制，属于王者的优势巍然不动。';

    var action;
    if (r.win) {
      action = '<button class="summon-cta" type="button" data-action="reward">夺取胜者力量</button>' +
        '<p class="boss-note">每一层的选择，都会留在后续征程里</p>';
    } else if (!bossState.lifeUsed) {
      action = '<button class="summon-cta" type="button" data-action="second-life">使用第二命令 • 地狱归来</button>' +
        '<p class="boss-note">全队强化后重战本层（本局仅一次）</p>' +
        '<button class="summon-cta" type="button" data-action="give-up" style="margin-top:12px;">放弃 • 结束本局</button>';
    } else {
      action = '<button class="summon-cta" type="button" data-action="give-up">本局结束</button>' +
        '<p class="boss-note">第二条命已用，征程止步于此</p>';
    }

    var resultBadge = r.win
      ? '<span class="result-badge win">挑战成功</span>'
      : '<span class="result-badge lose">挑战失败</span>';

    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">BATTLE RESULT</p>' +
      '<div class="fight-header">' +
        '<h3 class="fight-title">第' + bossState.floor + '层 • 战斗结算</h3>' +
        resultBadge +
      '</div>' +
      '<div class="vs-row">' +
        '<div class="vs-panel"><h5>成神方</h5>' +
          '<p class="vs-team">你的阵容</p>' +
          '<p class="vs-total">总分 ' + sumScore(bossState.myTeam) + '</p>' +
          '<div class="vs-mini">' + bossState.myTeam.map(function (p) {
            return '<div class="vs-player"><span>' + p.name + '</span><span class="vs-score">' + p.score + '</span></div>';
          }).join('') + '</div>' +
        '</div>' +
        '<span class="vs-mark">VS</span>' +
        '<div class="vs-panel enemy"><h5>本层守关者</h5>' +
          '<p class="vs-team">' + (boss.event || boss.year) + ' ' + boss.team + '</p>' +
          '<p class="vs-total">总分 ' + sumScore(boss.players) + '</p>' +
          '<div class="vs-mini">' + boss.players.map(function (p) {
            return '<div class="vs-player"><span>' + p.name + '</span><span class="vs-score">' + p.score + '</span></div>';
          }).join('') + '</div>' +
        '</div>' +
      '</div>' +
      '<p class="fight-flavor">' + flavor + '</p>' +
      '<div class="score-reveal">' +
        '<div class="score-big' + (r.win ? '' : ' lose') + '">' + r.myScore + ':' + r.bossScore + '</div>' +
        '<div class="score-verdict' + (r.win ? '' : ' lose') + '">' + (r.win ? '越过旧我' : '王座未破') + '</div>' +
      '</div>' +
      '<div style="margin-top:18px;">' + action + '</div>' +
      exitBtnHtml();
  }

  /* ---------- 图三：击破与夺取力量 ---------- */
  function renderBossReward() {
    var boss = currentBoss();
    var star = boss.players.slice().sort(function (a, b) { return b.score - a.score; })[0];

    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">BOSS DEFEATED</p>' +
      '<div class="score-reveal" style="margin-top:14px;">' +
        '<div class="score-big">' + bossState.result.myScore + ':' + bossState.result.bossScore + '</div>' +
        '<div class="score-verdict">第' + bossState.floor + '层 • 击破</div>' +
      '</div>' +
      '<p class="fight-flavor">旧影守住过无数场比赛，最终没能守住现在的' + star.name + '。</p>' +
      '<div class="boss-panel" style="margin-top:16px;">' +
        '<div class="boss-panel-head"><h4>夺取一种力量</h4><span class="panel-tag">每一层的选择，都会留在后续征程里</span></div>' +
        '<div class="reward-list">' +
          '<button class="reward-option" style="--i:0" type="button" data-action="recruit">' +
            '<h5>胜者招降</h5><p>从败军中带走一人，替换己方同排名选手</p></button>' +
          '<button class="reward-option" style="--i:1" type="button" data-action="awaken">' +
            '<h5>核心觉醒</h5><p>选择己方一人，随机永久 +10 或 -10</p></button>' +
          '<button class="reward-option" style="--i:2" type="button" data-action="synergy">' +
            '<h5>延续打法</h5><p>保留原阵，全队默契永久提升 +1 并累积道路刻印</p></button>' +
        '</div>' +
      '</div>' +
      exitBtnHtml();
  }

  /* 通用选择器 */
  function renderPicker(title, list, action, hint) {
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">CHOOSE</p>' +
      '<h3 class="boss-title" style="text-align:center;">' + title + '</h3>' +
      (hint ? '<p class="boss-sub" style="text-align:center;">' + hint + '</p>' : '') +
      '<ul class="picker-list">' + list.map(function (p, i) {
        return '<li style="--i:' + i + '">' +
          '<button class="picker-item" type="button" data-action="' + action + '" data-name="' + p.name + '">' +
          '<span class="picker-name">' + p.name + '</span>' +
          (p.team ? '<span class="mini-from">' + p.team + ' · ' + (p.event || p.year) + (p.rank ? ' · 队内#' + p.rank : '') + '</span>' : '') +
          '<span class="picker-score">' + p.score + '</span>' +
          '</button></li>';
      }).join('') + '</ul>' +
      exitBtnHtml();
  }

  function advanceFloor() {
    bossState.clears++;
    if (bossState.floor >= 9) {
      renderBossVictory();
      return;
    }
    bossState.floor++;
    renderBossFloor();
  }

  /* 征程总结：列出每一层队伍、比分与成败 */
  function journeyHistoryHtml() {
    if (!bossState.history.length) return '';
    var rows = bossState.history.map(function (h) {
      return '<li class="journey-row">' +
        '<span class="jr-floor">第' + h.floor + '层</span>' +
        '<span class="jr-boss" title="' + h.event + ' ' + h.team + '">' + h.title + ' · ' + h.event + ' ' + h.team + '</span>' +
        '<span class="jr-score' + (h.win ? '' : ' lose') + '">' + h.myScore + ':' + h.bossScore + '</span>' +
        '<span class="jr-tag' + (h.win ? ' win' : ' lose') + '">' + (h.win ? '挑战成功' : '挑战失败') + '</span>' +
      '</li>';
    }).join('');
    return '<div class="boss-panel" style="margin-top:20px;">' +
      '<div class="boss-panel-head"><h4>征程总结</h4><span class="panel-tag">共 ' + bossState.history.length + ' 层</span></div>' +
      '<ul class="journey-list">' + rows + '</ul>' +
    '</div>';
  }

  /* ---------- 结局：失败 / 成神 ---------- */
  function renderBossDefeat() {
    var r = bossState.result;
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">JOURNEY ENDS</p>' +
      '<div class="score-reveal" style="margin-top:26px;">' +
        '<div class="score-big lose">' + r.myScore + ':' + r.bossScore + '</div>' +
        '<div class="score-verdict" style="color:var(--text-gray);">第' + bossState.floor + '层 • 征程中断</div>' +
      '</div>' +
      '<p class="fight-flavor">王座仍立，本局就此结束。重整阵容，再来一次成神之旅。</p>' +
      journeyHistoryHtml() +
      '<button class="summon-cta" type="button" data-action="exit">退出本局</button>' +
      '<p class="boss-note">九层王座等你再战</p>';
  }

  function renderBossVictory() {
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">ASCENSION COMPLETE</p>' +
      '<div class="score-reveal" style="margin-top:26px;">' +
        '<div class="score-big">' + bossState.result.myScore + ':' + bossState.result.bossScore + '</div>' +
        '<div class="score-verdict">九层王座 • 全部击破</div>' +
      '</div>' +
      '<p class="fight-flavor">你已越过九层王座，登临金光大道的顶点。凡人之阵，今日成神。</p>' +
      journeyHistoryHtml() +
      '<div class="boss-panel">' +
        '<div class="boss-panel-head"><h4>成神阵容</h4><span class="panel-tag">总分 ' + sumScore(bossState.myTeam) + '</span></div>' +
        miniListHtml(bossState.myTeam, false) +
      '</div>' +
      '<button class="summon-cta" type="button" data-action="exit">退出本局</button>' +
      '<p class="boss-note">金光大道 • 未完待续</p>';
  }

  /* ---------- 事件 ---------- */
  function openBossFlow() {
    bossState.floor = 1;
    buildBosses(); // 每次开局重新随机抽取 9 位 Boss
    bossState.myTeam = flow.locked.map(function (p) {
      return { name: p.name, score: p.score, team: p.team, year: p.year, event: p.event, rank: p.rank };
    });
    bossState.lifeUsed = false;
    bossState.clears = 0;
    bossState.marks = 0;
    bossState.result = null;
    bossState.history = [];
    renderBossFloor();
    bossOverlay.classList.add('open');
    bossOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBossFlow() {
    bossOverlay.classList.remove('open');
    bossOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* 轻提示气泡 */
  function showToast(msg) {
    var t = document.createElement('div');
    t.className = 'gr-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    window.setTimeout(function () {
      t.classList.add('show');
      window.setTimeout(function () {
        t.classList.remove('show');
        window.setTimeout(function () {
          if (t.parentNode) t.parentNode.removeChild(t);
        }, 350);
      }, 1500);
    }, 30);
  }

  bossBody.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!btn) return;
    var action = btn.getAttribute('data-action');
    var name = btn.getAttribute('data-name');
    var boss = currentBoss();
    var idx = -1;

    switch (action) {
      case 'challenge':
        startFight();
        break;

      case 'reward':
        renderBossReward();
        break;

      case 'recruit': {
        /* 败军选手与己方同排名选手并排展示，点击一行立即交换 */
        var myRanks = bossState.myTeam.map(function (p) { return p.rank; });
        var items = boss.players
          .filter(function (p) { return myRanks.indexOf(p.rank) !== -1; })
          .map(function (p, i) {
            var mine = null;
            bossState.myTeam.some(function (m) {
              if (m.rank === p.rank) { mine = m; return true; }
              return false;
            });
            return '<li style="--i:' + i + '">' +
              '<button class="picker-item recruit-item" type="button" data-action="recruit-swap" data-name="' + p.name + '">' +
                '<span class="recruit-side">' +
                  '<span class="picker-name">' + p.name + '</span>' +
                  '<span class="mini-from">' + boss.team + ' · 队内#' + p.rank + '</span>' +
                  '<span class="picker-score">' + p.score + '</span>' +
                '</span>' +
                '<span class="recruit-swap-mark">⇄</span>' +
                '<span class="recruit-side recruit-right">' +
                  '<span class="picker-name">' + (mine ? mine.name : '-') + '</span>' +
                  '<span class="mini-from">' + (mine ? mine.team + ' · ' + (mine.event || mine.year) : '') + '</span>' +
                  '<span class="picker-score">' + (mine ? mine.score : '-') + '</span>' +
                '</span>' +
              '</button></li>';
          });
        bossBody.innerHTML =
          '<p class="boss-eyebrow" style="text-align:center;">CHOOSE</p>' +
          '<h3 class="boss-title" style="text-align:center;">胜者招降 • 选择败军选手</h3>' +
          '<p class="boss-sub" style="text-align:center;">点击一行立即完成交换</p>' +
          '<ul class="picker-list">' + items.join('') + '</ul>' +
          '<button class="summon-exit" type="button" data-action="recruit-cancel" style="display:block;margin:16px auto 0;">放弃交换</button>' +
          exitBtnHtml();
        break;
      }

      case 'recruit-swap': {
        /* 点击败军选手行：立即替换己方同排名选手，不进入新页面 */
        var pick = boss.players.filter(function (p) { return p.name === name; })[0];
        if (pick) {
          bossState.myTeam.some(function (p, i) {
            if (p.rank === pick.rank) {
              bossState.myTeam[i] = {
                name: pick.name,
                score: pick.score,
                team: boss.team,
                year: boss.year,
                event: boss.event || boss.year,
                rank: pick.rank
              };
              showToast(pick.name + ' 加入阵容，' + p.name + ' 离队（队内#' + pick.rank + '）');
              return true;
            }
            return false;
          });
        }
        advanceFloor();
        break;
      }

      case 'recruit-cancel':
        showToast('放弃交换，维持原阵');
        advanceFloor();
        break;

      case 'awaken':
        renderPicker('核心觉醒 • 选择己方选手', bossState.myTeam, 'awaken-pick', '被选中者随机永久 +10 或 -10');
        break;

      case 'awaken-pick':
        bossState.myTeam.some(function (p) {
          if (p.name === name) {
            var delta = Math.random() < 0.5 ? 10 : -10;
            p.score += delta;
            showToast(name + ' 觉醒成功，分数 ' + (delta > 0 ? '+' : '') + delta);
            return true;
          }
          return false;
        });
        advanceFloor();
        break;

      case 'synergy':
        bossState.myTeam.forEach(function (p) { p.score += 1; });
        bossState.marks++;
        advanceFloor();
        break;

      case 'second-life':
        bossState.lifeUsed = true;
        /* 地狱归来：全队每人分数 +3 后重战本层 */
        bossState.myTeam.forEach(function (p) { p.score += 3; });
        showToast('地狱归来 · 全队分数 +3');
        startFight();
        break;

      case 'give-up':
        renderBossDefeat();
        break;

      case 'exit':
        closeBossFlow();
        break;
    }
  });

  /* 调试钩子：控制台可读写 Boss 连战状态（正常玩法不依赖） */
  window.__GR_DEBUG__ = {
    bossState: bossState,
    bosses: function () { return BOSSES; },
    bossPool: function () { return BOSS_POOL; },
    buildBosses: buildBosses,
    startFight: startFight,
    renderBossFight: renderBossFight,
    renderBossReward: renderBossReward,
    renderBossDefeat: renderBossDefeat,
    renderBossVictory: renderBossVictory,
    renderBossFloor: renderBossFloor
  };
})();
