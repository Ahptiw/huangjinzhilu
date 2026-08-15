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
    agent: '开始逐梦模式',
    classic: '开始经典模式',
    ranked: '开始大核模式'
  };

  /* 规则提示条文字（随模式切换） */
  var RULES_BAR = {
    ascension: { title: '九冠王者 巅峰连战', desc: '集结强者，让阵容所向披靡' },
    agent: { title: '选定一位无冠冠军传奇', desc: '这次，我亲手为他补上最后一冠' },
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
    cards.forEach(function (c) {
      c.classList.remove('selected');
      var st = c.querySelector('.card-state');
      if (st) st.textContent = '可体验';
    });
    card.classList.add('selected');
    var cardState = card.querySelector('.card-state');
    if (cardState) cardState.textContent = '已选择';

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
    ascension: '5 次召唤完成初始阵容，逐层挑战<span class="rule-em">九层冠军 Boss</span>。获胜后可招降选手、觉醒选手或保留原阵继续闯关；前七层战败，可触发「<span class="rule-em">地狱归来</span>」试炼——答对一道数据问答即可全队强化重战当前 Boss，答错则第二条命作废。',
    /* 特工征召（逐梦模式） */
    agent: '先在九位候选人里挑选一名从未拿下<span class="rule-em">冠军赛冠军</span>的<span class="rule-em">逐梦主角</span>，再召唤四名队友。冲击<span class="rule-em">冠军赛</span>失败后，可保留主角不变，直接重新挑选四名队友，再度向冠军发起挑战。',
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

  /* ---------- 3. 主按钮反馈 / 进入召唤流程 ---------- */
  ctaBtn.addEventListener('click', function () {
    var selected = document.querySelector('.mode-card.selected');
    var mode = selected ? selected.getAttribute('data-mode') : 'ascension';

    if (mode === 'ascension') {
      // 成神试炼：打开召唤流程
      openFlow('ascension');
      return;
    }

    if (mode === 'agent') {
      // 逐梦模式：先选主角
      openDreamPick();
      return;
    }

    // 其他模式：触发出征闪光动画
    ctaBtn.classList.remove('launch');
    void ctaBtn.offsetWidth; // 强制重排以重新触发动画
    ctaBtn.classList.add('launch');

    var modeName = selected ? selected.getAttribute('data-name') : '成神试炼';
    showToast(modeName + ' 玩法开发中，敬请期待');
    console.log('[GOLDEN ROAD] 出征:', modeName);
  });

  /* ---------- 逐梦模式：选主角 ---------- */
  function openDreamPick() {
    if (!DREAM_POOL.length) {
      showToast('逐梦候选数据未加载');
      return;
    }
    flow.mode = 'dream';
    flow.hero = null;
    dreamSeen = [];
    renderDreamGrid();
    dreamOverlay.classList.add('open');
    dreamOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderDreamGrid() {
    var fresh = DREAM_POOL.filter(function (p) { return dreamSeen.indexOf(p.name) === -1; });
    var src = fresh.length >= 9 ? fresh : (dreamSeen = [], DREAM_POOL);
    var picks = shuffle(src).slice(0, 9);
    picks.forEach(function (p) {
      if (dreamSeen.indexOf(p.name) === -1) dreamSeen.push(p.name);
    });
    dreamGrid.innerHTML = picks.map(function (p, i) {
      return '<li style="--i:' + i + '">' +
        '<button class="dream-card" type="button" data-name="' + p.name + '">' +
          '<span class="dream-name">' + p.name + '</span>' +
          '<span class="dream-meta">' + p.team + ' · ' + (p.event || p.year) + '</span>' +
          '<span class="dream-score">' + p.score + '</span>' +
        '</button></li>';
    }).join('');
  }

  function pickDreamHero(name) {
    var hero = DREAM_POOL.filter(function (p) { return p.name === name; })[0];
    if (!hero) return;
    flow.hero = {
      name: hero.name,
      score: hero.score,
      team: hero.team,
      year: hero.year,
      event: hero.event || hero.year,
      rank: 1 // 主角占队内名次 1
    };
    flow.dreamAttempts = 1; // 首次冲冠
    dreamOverlay.classList.remove('open');
    dreamOverlay.setAttribute('aria-hidden', 'true');
    showToast('已选定逐梦主角:' + hero.name);
    openFlow('dream');
  }

  /* 出征闪光动画（由 JS 触发一次） */
  ctaBtn.addEventListener('animationend', function () {
    ctaBtn.classList.remove('launch');
  });

  /* ---------- 4. 成神试炼：召唤流程（5 次召唤） ---------- */
  var summonOverlay = document.getElementById('summon-overlay');
  var summonEyebrow = document.getElementById('summon-eyebrow');
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

  /* 逐梦模式弹层 */
  var dreamOverlay = document.getElementById('dream-overlay');
  var dreamGrid = document.getElementById('dream-grid');
  var dreamReroll = document.getElementById('dream-reroll');
  var dreamExit = document.getElementById('dream-exit');

  /* 战队池：仅从 players.json 加载，脚本内不内置任何选手数据 */
  var TEAM_POOL = [];
  var TEAMS_BY_YEAR = {}; // 按赛事年份分组索引，供「同年换队」使用

  /* 逐梦模式候选（从未拿下冠军赛冠军的选手） */
  var DREAM_POOL = [];
  var dreamSeen = []; // 本轮已出现过的候选名字

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

    /* 逐梦候选:从未拿下冠军赛冠军的选手 */
    if (window.GOLDEN_ROAD_NO_CHAMPIONS && Array.isArray(window.GOLDEN_ROAD_NO_CHAMPIONS.players)) {
      DREAM_POOL = window.GOLDEN_ROAD_NO_CHAMPIONS.players.map(function (p) {
        return {
          name: p.name,
          score: Number(p.score) || 0,
          team: p.team || '',
          event: p.event || '',
          year: p.year || ''
        };
      });
      console.log('[GOLDEN ROAD] 已加载逐梦候选:', DREAM_POOL.length, '位无冠选手');
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
    rerollTeam: 1,
    totalRounds: 5,    // 成神试炼 5 次 / 逐梦模式 4 次
    mode: 'ascension', // ascension | dream
    hero: null         // 逐梦模式主角
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
    if (flow.hero && flow.hero.name === name) return true;
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

  /* 五个槽位：逐梦模式第 1 席为主角，其余为已锁定队友 */
  function renderRoleSlots() {
    roleSlots.forEach(function (slot, i) {
      var hexText = slot.querySelector('.role-hex-text');
      var status = slot.querySelector('.role-status');
      var player = null;
      if (flow.hero && i === 0) {
        player = flow.hero;
      } else {
        player = flow.locked[flow.hero ? i - 1 : i] || null;
      }
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
    var isDream = flow.mode === 'dream';
    if (flow.phase === 'summon') {
      var noData = TEAM_POOL.length === 0;
      summonTitle.textContent = isDream ? '正在召唤队友' : '正在召唤';
      summonRound.textContent = '第' + flow.round + '/' + flow.totalRounds + '次召唤';
      riftResult.textContent = noData ? '数据缺失' : '?? • ???';
      riftHint.textContent = noData ? '未加载到 players.json，请检查数据文件是否完整' : '点击下方按钮，召唤一支战队';
      summonCta.textContent = '召唤';
      summonCta.disabled = noData;
      rosterPanel.hidden = true;
    } else if (flow.phase === 'lock') {
      summonTitle.textContent = isDream ? '请锁定队友' : '请锁定选手';
      summonRound.textContent = '第' + flow.round + '/' + flow.totalRounds + '次召唤';
      riftResult.textContent = evLabel(flow.current) + ' • ' + flow.current.team;
      riftHint.textContent = '只能锁定队内第 1-5 名，且名次不可重复';
      summonCta.textContent = '点击锁定';
      summonCta.disabled = true;
      rosterPanel.hidden = false;
      renderRoster();
    } else if (flow.phase === 'done') {
      summonTitle.textContent = isDream ? '逐梦阵容已就绪' : '召唤完成';
      summonRound.textContent = flow.totalRounds + '/' + flow.totalRounds + ' 次召唤完成';
      riftResult.textContent = isDream ? '主角与四位队友并肩出征' : '成神阵容已就绪';
      riftHint.textContent = isDream ? '点击下方按钮，开始冲击冠军赛' : '点击下方按钮，开始九层冠军 Boss 连战';
      summonCta.textContent = isDream ? '开始冲击' : '开始征程';
      summonCta.disabled = false;
      rosterPanel.hidden = true;
    }
    renderRerollBtns();
  }

  function openFlow(mode) {
    var isDream = mode === 'dream';
    flow.mode = isDream ? 'dream' : 'ascension';
    flow.totalRounds = isDream ? 4 : 5;
    summonEyebrow.textContent = isDream ? 'GOLDEN ROAD · DREAM' : 'GOLDEN ROAD · ASCENSION';
    if (!isDream) flow.hero = null;
    flow.round = 1;
    flow.phase = 'summon';
    flow.current = null;
    flow.drawnKeys = [];
    flow.locked = [];
    flow.usedRanks = isDream && flow.hero ? [flow.hero.rank] : [];
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
    flow.phase = flow.round > flow.totalRounds ? 'done' : 'summon';
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
      if (flow.mode === 'dream') {
        /* 逐梦模式:进入六站征程判定 */
        openDreamJourney();
      } else {
        console.log('[GOLDEN ROAD] 阵容:', flow.locked.map(function (p) { return p.name; }).join(' / '));
        openBossFlow();
      }
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

  /* 逐梦弹层事件 */
  dreamGrid.addEventListener('click', function (e) {
    var card = e.target.closest ? e.target.closest('.dream-card') : null;
    if (card) pickDreamHero(card.getAttribute('data-name'));
  });

  dreamReroll.addEventListener('click', function () {
    renderDreamGrid();
    showToast('已换一批候选');
  });

  dreamExit.addEventListener('click', function () {
    dreamOverlay.classList.remove('open');
    dreamOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

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
    history: [],     // 每层战果 [{floor, title, team, event, win, myScore, bossScore}]
    reviveQuiz: null // 复活试炼题目 {label, correct, options}
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
    var isDream = flow.mode === 'dream';
    var retryBtn = isDream
      ? '<button class="summon-cta" type="button" data-action="dream-retry" style="margin-top:12px;">保留主角 · 重新挑选四名队友</button>'
      : '';
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">' + (isDream ? 'DREAM BROKEN' : 'JOURNEY ENDS') + '</p>' +
      '<div class="score-reveal" style="margin-top:26px;">' +
        '<div class="score-big lose">' + r.myScore + ':' + r.bossScore + '</div>' +
        '<div class="score-verdict" style="color:var(--text-gray);">第' + bossState.floor + '层 • ' + (isDream ? '冲击失败' : '征程中断') + '</div>' +
      '</div>' +
      '<p class="fight-flavor">' + (isDream ? '冠军仍远，主角的梦还没有结束。保留他，换一批队友，再度发起挑战。' : '王座仍立，本局就此结束。重整阵容，再来一次成神之旅。') + '</p>' +
      journeyHistoryHtml() +
      retryBtn +
      '<button class="summon-cta" type="button" data-action="exit" style="margin-top:12px;">退出本局</button>' +
      '<p class="boss-note">' + (isDream ? '未竟的冠军梦，等你续写' : '九层王座等你再战') + '</p>';
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

  /* ---------- 复活试炼：数据问答 ---------- */
  function makeReviveQuiz() {
    /* 按赛事分组收集全部选手 */
    var byEvent = {};
    TEAM_POOL.forEach(function (t) {
      var label = t.event || t.year;
      byEvent[label] = byEvent[label] || [];
      t.players.forEach(function (p) {
        byEvent[label].push({ name: p.name, team: t.team, score: p.score });
      });
    });
    var labels = Object.keys(byEvent).filter(function (l) { return byEvent[l].length >= 4; });
    if (!labels.length) return null;
    var label = labels[Math.floor(Math.random() * labels.length)];
    var pool = byEvent[label].slice().sort(function (a, b) { return b.score - a.score; });
    /* 正确答案:分数最高者(保证唯一) */
    var correct = pool[0];
    var options = [correct];
    var rest = pool.slice(1);
    shuffle(rest);
    for (var i = 0; i < rest.length && options.length < 4; i++) {
      var dup = options.some(function (o) { return o.score === rest[i].score; });
      if (!dup) options.push(rest[i]);
    }
    if (options.length < 4) return null;
    shuffle(options);
    return { label: label, correct: correct, options: options };
  }

  function renderReviveQuiz() {
    var q = bossState.reviveQuiz;
    if (!q) {
      bossState.lifeUsed = true;
      renderBossDefeat();
      return;
    }
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">REVIVE TRIAL</p>' +
      '<h3 class="boss-title" style="text-align:center;">复活试炼 • 数据问答</h3>' +
      '<p class="boss-sub" style="text-align:center;">答对即可触发地狱归来；答错第二条命作废</p>' +
      '<div class="boss-panel" style="margin-top:20px;">' +
        '<p style="text-align:center;font-size:15px;letter-spacing:1px;">在一次「' + q.label + '」比赛中,以下四位选手谁的数据更好?</p>' +
      '</div>' +
      '<ul class="picker-list">' + q.options.map(function (o, i) {
        return '<li style="--i:' + i + '">' +
          '<button class="picker-item" type="button" data-action="revive-answer" data-name="' + o.name + '">' +
            '<span class="picker-name">' + o.name + '</span>' +
            '<span class="mini-from">' + o.team + '</span>' +
          '</button></li>';
      }).join('') + '</ul>' +
      '<p class="boss-note">分数不会展示 • 凭你对选手的了解作答</p>' +
      exitBtnHtml();
  }

  function renderReviveFail() {
    var q = bossState.reviveQuiz;
    var correct = q.correct;
    var r = bossState.result;
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">REVIVE FAILED</p>' +
      '<h3 class="boss-title" style="text-align:center;">回答错误 • 第二条命失效</h3>' +
      '<p class="boss-sub" style="text-align:center;">正确答案是 <strong style="color:var(--brand);">' + correct.name + ' (' + correct.team + ')</strong></p>' +
      '<div class="score-reveal" style="margin-top:20px;">' +
        '<div class="score-big lose">' + r.myScore + ':' + r.bossScore + '</div>' +
        '<div class="score-verdict lose">王座未破</div>' +
      '</div>' +
      '<button class="summon-cta" type="button" data-action="give-up">本局结束</button>' +
      '<p class="boss-note">第二条命已用，征程止步于此</p>';
  }

  /* ---------- 逐梦征程:六站判定 ---------- */
  var dreamJourney = []; // [{event, champTeam, champScore, win}]

  function dreamMembers() {
    return flow.hero ? [flow.hero].concat(flow.locked) : flow.locked;
  }

  /* 六站:前四站固定,后两站随机一个大师赛 + 一个全球冠军赛 */
  function buildDreamJourney() {
    var fixed = ['2026启点赛', '圣地亚哥大师赛', '2026第一赛段', '伦敦大师赛'];
    var stages = fixed.map(function (ev) {
      return CHAMPION_TEAMS.filter(function (t) { return t.event === ev; })[0] || null;
    });
    var masters = CHAMPION_TEAMS.filter(function (t) {
      return /大师赛/.test(t.event) && fixed.indexOf(t.event) === -1;
    });
    var worlds = CHAMPION_TEAMS.filter(function (t) {
      return /全球冠军赛/.test(t.event) && t.year !== '2026';
    });
    if (masters.length) stages.push(randPick(masters));
    if (worlds.length) stages.push(randPick(worlds));

    var myTotal = sumScore(dreamMembers());
    return stages.map(function (t) {
      var cs = t ? sumScore(t.players) : 0;
      return {
        event: t ? t.event : '未知赛事',
        champTeam: t ? t.team : '-',
        champScore: cs,
        win: t ? myTotal > cs : false
      };
    });
  }

  function dreamStageRows(withProbe) {
    var myTotal = sumScore(dreamMembers());
    return dreamJourney.map(function (s, i) {
      var probe = withProbe
        ? '<span class="ds-probe"><span class="ds-dot"></span>激战中…</span>'
        : '';
      return '<li class="dream-stage' + (withProbe ? ' pending' : (s.win ? ' win' : ' lose')) + '" style="--i:' + i + '">' +
        '<span class="ds-num">' + (i + 1) + '</span>' +
        '<span class="ds-info">' +
          '<span class="ds-event">' + s.event + '</span>' +
          '<span class="ds-champ">冠军 ' + s.champTeam + ' · ' + s.champScore + ' 分</span>' +
        '</span>' +
        '<span class="ds-score">' + myTotal + ' : ' + s.champScore + '</span>' +
        '<span class="ds-tag">' + (s.win ? '夺冠' : '未夺冠') + '</span>' +
        probe +
      '</li>';
    }).join('');
  }

  var dreamTimer = null;

  /* 逐站揭晓:每站判定 3 秒后显示结果,全部揭晓后自动进入结局 */
  function revealDreamStages() {
    var items = bossBody.querySelectorAll('.dream-stage.pending');
    var i = 0;
    function next() {
      if (i >= items.length) {
        /* 全部揭晓:直接进入对应结局(夺冠→圆梦,未夺冠→梦还没有结束) */
        if (dreamJourney.length) {
          if (dreamJourney[dreamJourney.length - 1].win) {
            renderDreamSuccess();
          } else {
            renderDreamFail();
          }
        }
        dreamTimer = null;
        return;
      }
      dreamTimer = window.setTimeout(function () {
        var el = items[i];
        el.classList.remove('pending');
        el.classList.add(dreamJourney[i] && dreamJourney[i].win ? 'win' : 'lose');
        el.classList.add('revealed');
        i++;
        next();
      }, 3000);
    }
    next();
  }

  function openDreamJourney() {
    dreamJourney = buildDreamJourney();
    renderDreamJourney();
    bossOverlay.classList.add('open');
    bossOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function renderDreamJourney() {
    var hero = flow.hero;
    var myTotal = sumScore(dreamMembers());
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">THE GOLDEN ROAD</p>' +
      '<h3 class="boss-title" style="text-align:center;">征程开始</h3>' +
      '<p class="boss-sub" style="text-align:center;">圆梦模式 · 四位队友已经就位，陪 ' + hero.name + ' 再走一次六站征程</p>' +
      '<div class="boss-panel" style="margin-top:20px;">' +
        '<div class="boss-panel-head"><h4>阵容总分 ' + myTotal + '</h4><span class="panel-tag">主角 ' + hero.name + ' · ' + hero.score + ' 分</span></div>' +
        miniListHtml(dreamMembers(), false) +
      '</div>' +
      '<ul class="dream-stage-list">' + dreamStageRows(true) + '</ul>' +
      exitBtnHtml();
    revealDreamStages();
  }

  /* 战报五卡:仅主角头顶标注「夙愿」,其余四人不标位置 */
  function reportHeroesHtml() {
    var members = dreamMembers();
    var heroName = flow.hero ? flow.hero.name : '';
    return '<div class="report-heroes">' + members.map(function (p, i) {
      var isLeader = i === 0 && p.name === heroName;
      var role = isLeader
        ? '<span class="hc-role role-lead">夙愿</span>'
        : '<span class="hc-role hc-role-empty"></span>';
      return '<div class="hero-card' + (isLeader ? ' leader' : '') + '">' +
        role +
        '<span class="hc-name">' + p.name + '</span>' +
        '<span class="hc-from">' + p.team + ' · ' + (p.event || p.year) + '</span>' +
        '<span class="hc-score">' + p.score + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  function renderDreamSuccess() {
    var hero = flow.hero;
    var myTotal = sumScore(dreamMembers());
    var last = dreamJourney[dreamJourney.length - 1];
    var wins = dreamJourney.filter(function (s) { return s.win; }).length;
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">CROWN COMPLETE</p>' +
      '<h3 class="dream-fail-title">今朝圆梦</h3>' +
      '<p class="dream-fail-sub">THE DREAM FULFILLED</p>' +
      '<div class="score-reveal" style="margin-top:16px;">' +
        '<div class="score-big">' + myTotal + ':' + last.champScore + '</div>' +
        '<div class="score-verdict">' + last.event + ' • 夺冠</div>' +
      '</div>' +
      reportHeroesHtml() +
      '<p class="report-announce"><b>' + hero.name + '，今朝圆梦加冕！</b><br>最后一冠，由你亲手为他补上。</p>' +
      '<p class="dream-fail-sub">第' + (flow.dreamAttempts || 1) + '次冲冠 · 六站 ' + wins + ' 冠 ' + (dreamJourney.length - wins) + ' 负</p>' +
      '<div class="fail-actions">' +
        '<button class="summon-cta gold" type="button" data-action="dream-again">再来一次</button>' +
        '<button class="summon-cta" type="button" data-action="exit">切换模式 · 返回主页</button>' +
      '</div>' +
      '<p class="boss-note">逐梦之路，圆满收官</p>';
  }

  function renderDreamFail() {
    var hero = flow.hero;
    var myTotal = sumScore(dreamMembers());
    var last = dreamJourney[dreamJourney.length - 1];
    var attempts = flow.dreamAttempts || 1;
    bossBody.innerHTML =
      '<div class="crown-badge">♛</div>' +
      '<p class="boss-eyebrow" style="text-align:center;margin-top:14px;">DREAM CONTINUES</p>' +
      '<h3 class="dream-fail-title">梦想仍未落幕</h3>' +
      '<p class="dream-fail-sub">' + hero.name + ' • 第' + attempts + '次冲冠</p>' +
      '<div class="score-reveal" style="margin-top:16px;">' +
        '<div class="score-big lose">' + myTotal + ':' + last.champScore + '</div>' +
        '<div class="score-verdict lose">' + last.event + ' • 未夺冠</div>' +
      '</div>' +
      '<p class="fight-flavor">这套阵容未能助 ' + hero.name + ' 捧起全球总决赛奖杯。主角将继续留队，你可为他重新征召四名队友。</p>' +
      '<div class="fail-actions">' +
        '<button class="summon-cta gold" type="button" data-action="dream-retry">携他再战 · 重选四名队友</button>' +
        '<button class="summon-cta" type="button" data-action="dream-report">接受结局，生成战报</button>' +
      '</div>' +
      exitBtnHtml() +
      '<p class="boss-note">失败只是中场，不是终场</p>';
  }

  function renderDreamReport() {
    var hero = flow.hero;
    var wins = dreamJourney.filter(function (s) { return s.win; }).length;
    bossBody.innerHTML =
      '<p class="boss-eyebrow" style="text-align:center;">MATCH REPORT</p>' +
      '<h3 class="dream-fail-title">' + hero.name + '，桂冠依旧缺席。</h3>' +
      reportHeroesHtml() +
      '<p class="report-announce">队伍止步于终点之前，逐梦之路远未落幕。</p>' +
      '<p class="dream-fail-sub">第 ' + (flow.dreamAttempts || 1) + ' 次冲冠・六战 ' + wins + ' 冠 ' + (dreamJourney.length - wins) + ' 负</p>' +
      '<div class="fail-actions">' +
        '<button class="summon-cta gold" type="button" data-action="dream-again">再度出征</button>' +
        '<button class="summon-cta" type="button" data-action="exit">切换模式・返回主页</button>' +
      '</div>' +
      '<p class="boss-note">咫尺望冠，终待荣光</p>';
  }

  /* ---------- 事件 ---------- */
  function openBossFlow() {
    bossState.floor = 1;
    buildBosses(); // 每次开局重新随机抽取 9 位 Boss
    /* 逐梦模式:主角 + 四位队友;成神试炼:五位选手 */
    var members = (flow.mode === 'dream' && flow.hero)
      ? [flow.hero].concat(flow.locked)
      : flow.locked;
    bossState.myTeam = members.map(function (p) {
      return { name: p.name, score: p.score, team: p.team, year: p.year, event: p.event, rank: p.rank };
    });
    bossState.lifeUsed = false;
    bossState.clears = 0;
    bossState.marks = 0;
    bossState.result = null;
    bossState.history = [];
    bossState.reviveQuiz = null;
    renderBossFloor();
    bossOverlay.classList.add('open');
    bossOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeBossFlow() {
    if (dreamTimer) { window.clearTimeout(dreamTimer); dreamTimer = null; }
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

      case 'second-life': {
        /* 复活试炼:先答题,答对才复活 */
        var quiz = makeReviveQuiz();
        if (quiz) {
          bossState.reviveQuiz = quiz;
          renderReviveQuiz();
        } else {
          /* 数据不足时兜底:直接复活 */
          bossState.lifeUsed = true;
          bossState.myTeam.forEach(function (p) { p.score += 3; });
          showToast('地狱归来 · 全队分数 +3');
          startFight();
        }
        break;
      }

      case 'revive-answer': {
        var quiz2 = bossState.reviveQuiz;
        if (!quiz2) break;
        /* 无论对错,第二条命都消耗 */
        bossState.lifeUsed = true;
        var picked = quiz2.options.filter(function (o) { return o.name === name; })[0];
        if (picked && picked.score === quiz2.correct.score) {
          bossState.myTeam.forEach(function (p) { p.score += 3; });
          showToast('答题正确!地狱归来 · 全队分数 +3');
          startFight();
        } else {
          showToast('回答错误，第二条命失效');
          renderReviveFail();
        }
        break;
      }

      case 'give-up':
        renderBossDefeat();
        break;

      case 'dream-retry':
        /* 逐梦模式:保留主角,重新挑选四名队友 */
        closeBossFlow();
        flow.dreamAttempts = (flow.dreamAttempts || 1) + 1;
        showToast('主角不变,重新挑选四名队友');
        openFlow('dream');
        break;

      case 'dream-result':
        if (dreamJourney.length && dreamJourney[dreamJourney.length - 1].win) {
          renderDreamSuccess();
        } else {
          renderDreamFail();
        }
        break;

      case 'dream-report':
        renderDreamReport();
        break;

      case 'dream-again':
        /* 战报页「再来一次」:全新开始,重新选主角 */
        closeBossFlow();
        openDreamPick();
        break;

      case 'exit':
        closeBossFlow();
        break;
    }
  });

  /* 调试钩子：控制台可读写 Boss 连战状态（正常玩法不依赖） */
  window.__GR_DEBUG__ = {
    bossState: bossState,
    flow: flow,
    openFlow: openFlow,
    dreamJourney: function () { return dreamJourney; },
    setDreamJourney: function (stages) { dreamJourney = stages; },
    openDreamJourney: openDreamJourney,
    renderDreamJourney: renderDreamJourney,
    renderDreamSuccess: renderDreamSuccess,
    renderDreamFail: renderDreamFail,
    renderDreamReport: renderDreamReport,
    buildDreamJourney: buildDreamJourney,
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
