import { useMemo, useState } from "react";
import "./App.css";

const AVATARS = [
  {
    id: "bear",
    name: "Bear",
    image: "/assets/avatars/bear_front.png",
  },
  {
    id: "cat",
    name: "coming soon",
    image: null,
  },
  {
    id: "dog",
    name: "coming soon",
    image: null,
  },
];

const ART = {
  logo: null,
  avatars: {
    bear: null,
    cat: null,
    dog: null,
  },
  arenas: {
    starter: null,
    midterm: null,
    finals: null,
  },
  rewards: {
    starterChest: null,
    studyBoost: null,
    rareChest: null,
    focusBadge: null,
    finalsChest: null,
  },
  cosmetics: {
    knightHelmet: null,
    royalCrown: null,
  },
};

const initialQuests = [
  {
    id: 1,
    title: "Assignment 1: Product Vision",
    course: "COMP 380",
    due: "Tomorrow",
    xp: 150,
    trophies: 35,
    completed: false,
  },
  {
    id: 2,
    title: "Assignment 2",
    course: "COMP 380",
    due: "Tonight",
    xp: 75,
    trophies: 20,
    completed: false,
  },
  {
    id: 3,
    title: "Project Proposal",
    course: "COMP 380",
    due: "Completed",
    xp: 100,
    trophies: 25,
    completed: true,
  },
];

const arenas = [
  {
    id: "starter",
    name: "Starter Season",
    subtitle: "Build Foundations",
    range: "0–999",
    min: 0,
    max: 999,
    theme: "forest",
    art: ART.arenas.starter,
  },
  {
    id: "midterm",
    name: "Midterm Season",
    subtitle: "Prove Discipline",
    range: "1,000–1,999",
    min: 1000,
    max: 1999,
    theme: "ice",
    art: ART.arenas.midterm,
  },
  {
    id: "finals",
    name: "Finals Season",
    subtitle: "Achieve Greatness",
    range: "2,000+",
    min: 2000,
    max: Infinity,
    theme: "void",
    art: ART.arenas.finals,
  },
];

const roadRewards = [
  {
    id: "starter-chest",
    threshold: 250,
    arena: "starter",
    type: "chest",
    title: "Starter Chest",
    description: "A small collection of early-semester supplies.",
    reward: { trophies: 40 },
    art: ART.rewards.starterChest,
  },
  {
    id: "focus-badge",
    threshold: 500,
    arena: "starter",
    type: "badge",
    title: "Focus Badge",
    description: "A profile badge for staying consistent.",
    reward: { badge: "Focus Badge" },
    art: ART.rewards.focusBadge,
  },
  {
    id: "study boost",
    threshold: 800,
    arena: "starter",
    type: "boost",
    title: "Study Boost",
    description: "Adds 50 XP as a single one time use progression boost.",
    reward: { xp: 50 },
    art: ART.rewards.studyBoost,
  },
  {
    id: "common chest",
    threshold: 1000,
    arena: "midterm",
    type: "chest",
    title: "Common Chest",
    description: "A trophy reward for reaching midterm season.",
    reward: { trophies: 75 },
    art: ART.rewards.starterChest,
  },
  
  {
    id: "rare chest",
    threshold: 1500,
    arena: "midterm",
    type: "chest",
    title: "Rare Chest",
    description: "A premium trophy reward.",
    reward: { trophies: 125 },
    art: ART.rewards.rareChest,
  },

  {
    id: "finals chest",
    threshold: 2500,
    arena: "finals",
    type: "chest",
    title: "Finals Chest",
    description: "A milestone chest for reaching the final academic arena.",
    reward: { trophies: 175, xp: 100 },
    art: ART.rewards.finalsChest,
  },
];

const shopItems = [
  {
    id: "knight-helmet",
    name: "Knight Helmet",
    category: "hat",
    rarity: "Rare",
    icon: "",
    cost: 350,
    art: ART.cosmetics.knightHelmet,
  },
  {
    id: "royal-crown",
    name: "Royal Crown",
    category: "hat",
    rarity: "Epic",
    icon: "",
    cost: 700,
    art: ART.cosmetics.royalCrown,
  },

];

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [quests, setQuests] = useState(initialQuests);
  const [playerXP, setPlayerXP] = useState(450);
  const [trophies, setTrophies] = useState(875);
  const [selectedAvatarId, setSelectedAvatarId] = useState("bear");
  const selectedAvatar =
        AVATARS.find((avatar) => avatar.id === selectedAvatarId) ?? AVATARS[0];
  const [ownedCosmetics, setOwnedCosmetics] = useState([null]);
  const [equippedCosmetics, setEquippedCosmetics] = useState({
    accessory: null,
    hat: null,
    outfit: null,
    theme: null,
  });
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [badges, setBadges] = useState([]);
  const [toast, setToast] = useState("");

  const xpPerLevel = 500;
  const level = Math.floor(playerXP / xpPerLevel) + 1;
  const currentLevelXP = playerXP % xpPerLevel;
  const xpPercent = Math.min((currentLevelXP / xpPerLevel) * 100, 100);

  const currentArena = useMemo(
    () => arenas.find((arena) => trophies >= arena.min && trophies <= arena.max) ?? arenas[0],
    [trophies]
  );

  function showToast(message) {
    setToast(message);
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(""), 2600);
  }

  function completeQuest(questId) {
    const selectedQuest = quests.find((quest) => quest.id === questId);
    if (!selectedQuest || selectedQuest.completed) return;

    setQuests((currentQuests) =>
      currentQuests.map((quest) =>
        quest.id === questId ? { ...quest, completed: true } : quest
      )
    );
    setPlayerXP((currentXP) => currentXP + selectedQuest.xp);
    setTrophies((currentTrophies) => currentTrophies + selectedQuest.trophies);
    showToast(`Quest complete: +${selectedQuest.xp} XP and +${selectedQuest.trophies} trophies`);
  }

  function buyCosmetic(item) {
    if (ownedCosmetics.includes(item.id)) {
      equipCosmetic(item);
      return;
    }

    if (trophies < item.cost) {
      showToast("You need more trophies for this item.");
      return;
    }

    setTrophies((current) => current - item.cost);
    setOwnedCosmetics((current) => [...current, item.id]);
    setEquippedCosmetics((current) => ({ ...current, [item.category]: item.id }));
    showToast(`${item.name} unlocked and equipped.`);
  }

  function equipCosmetic(item) {
    if (!ownedCosmetics.includes(item.id)) return;
    setEquippedCosmetics((current) => ({ ...current, [item.category]: item.id }));
    showToast(`${item.name} equipped.`);
  }

  function claimRoadReward(reward) {
    if (trophies < reward.threshold || claimedRewards.includes(reward.id)) return;

    setClaimedRewards((current) => [...current, reward.id]);

    if (reward.reward.trophies) {
      setTrophies((current) => current + reward.reward.trophies);
    }
    if (reward.reward.xp) {
      setPlayerXP((current) => current + reward.reward.xp);
    }
    if (reward.reward.cosmeticId) {
      setOwnedCosmetics((current) =>
        current.includes(reward.reward.cosmeticId)
          ? current
          : [...current, reward.reward.cosmeticId]
      );
    }
    if (reward.reward.badge) {
      setBadges((current) =>
        current.includes(reward.reward.badge)
          ? current
          : [...current, reward.reward.badge]
      );
    }

    showToast(`${reward.title} claimed.`);
  }

  return (
    <div className="app-shell">
      {toast && <div className="toast" role="status">{toast}</div>}

      <header className="top-bar">
        <div>
          <h1>MataQUEST</h1>
        </div>
        <div className="currency-panel">
          <div className="currency"><span></span><strong>{trophies}</strong></div>
          <div className="currency"><span></span><strong>{playerXP} XP</strong></div>
        </div>
      </header>

      <main>
        {activeTab === "home" && (
          <HomeScreen
            level={level}
            currentLevelXP={currentLevelXP}
            xpPerLevel={xpPerLevel}
            xpPercent={xpPercent}
            quests={quests}
            completeQuest={completeQuest}
            selectedAvatar={selectedAvatar}
            currentArena={currentArena}
          />
        )}

        {activeTab === "road" && (
          <TrophyRoad
            trophies={trophies}
            playerXP={playerXP}
            currentArena={currentArena}
            claimedRewards={claimedRewards}
            onClaim={claimRoadReward}
          />
        )}

        {activeTab === "avatar" && (
          <AvatarScreen
            avatars={AVATARS}
            selectedAvatarId={selectedAvatarId}
            onSelectAvatar={setSelectedAvatarId}
            equippedCosmetics={equippedCosmetics}
            ownedCosmetics={ownedCosmetics}
          />
        )}

        {activeTab === "shop" && (
          <ShopScreen
            trophies={trophies}
            ownedCosmetics={ownedCosmetics}
            equippedCosmetics={equippedCosmetics}
            onBuy={buyCosmetic}
            onEquip={equipCosmetic}
          />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        <NavButton icon="" label="Home" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
        <NavButton icon="" label="Road" active={activeTab === "road"} onClick={() => setActiveTab("road")} />
        <NavButton icon="" label="Avatar" active={activeTab === "avatar"} onClick={() => setActiveTab("avatar")} />
        <NavButton icon="" label="Shop" active={activeTab === "shop"} onClick={() => setActiveTab("shop")} />
      </nav>
    </div>
  );
}

function ArtSlot({ src, label, className = "" }) {
  if (src) return <img className={`art-slot ${className}`} src={src} alt={label} />;
  return <div className={`art-slot art-placeholder ${className}`} aria-label={`${label} placeholder`}><span>{label}</span></div>;
}

function HomeScreen({ level, currentLevelXP, xpPerLevel, xpPercent, quests, completeQuest, selectedAvatar, currentArena }) {
  const remainingQuests = quests.filter((quest) => !quest.completed).length;
  const avatarEmoji = { bear: "", cat: "", dog: "" }[selectedAvatar];

  return (
    <div className="home-grid">
      <section className="hero-card">
        <div className="avatar-circle">
  <img
    src={selectedAvatar.image}
    alt={`${selectedAvatar.name} avatar`}
    className="home-avatar-image pixel-art"
  />
</div>
        <div className="hero-content">
          <p className="eyebrow">{currentArena.name.toUpperCase()}</p>
          <h2>USERNAME HERE </h2>
          <p className="hero-description"> Level {level}</p>
          <div className="xp-row"><span>{currentLevelXP} / {xpPerLevel} XP</span><span>Level {level + 1}</span></div>
          <div className="xp-track"><div className="xp-fill" style={{ width: `${xpPercent}%` }} /></div>
        </div>
      </section>

      <section className="stat-grid">
        <StatCard icon="" value={remainingQuests} label="Active Quests" />
        <StatCard icon="" value={quests.length - remainingQuests} label="Completed" />
        <StatCard icon="" value="3" label="Day Streak" />
      </section>

      <section className="quest-section">
        <div className="section-heading">
          <div><p className="eyebrow">CANVAS QUEST LOG</p><h2>Today’s Quests</h2></div>
          <span className="quest-count">{remainingQuests} remaining</span>
        </div>
        <div className="quest-list">
          {quests.map((quest) => <QuestCard key={quest.id} quest={quest} onComplete={completeQuest} />)}
        </div>
      </section>
    </div>
  );
}

function QuestCard({ quest, onComplete }) {
  return (
    <article className={`quest-card ${quest.completed ? "quest-completed" : ""}`}>
      <div className="quest-icon">{quest.completed ? "✅" : "-"}</div>
      <div className="quest-info"><span className="course-tag">{quest.course}</span><h3>{quest.title}</h3><p>Due: {quest.due}</p></div>
      <div className="reward-panel"><span> +{quest.xp}</span><span> +{quest.trophies}</span></div>
      <button className="complete-button" disabled={quest.completed} onClick={() => onComplete(quest.id)}>{quest.completed ? "Quest Complete" : "Complete Quest"}</button>
    </article>
  );
}

function TrophyRoad({ trophies, currentArena, claimedRewards, onClaim }) {
  const nextArena = arenas.find((arena) => arena.min > trophies);

  return (
    <section className="panel-page trophy-page">
      <div className="road-header">
        <div><p className="eyebrow">SEMESTER PROGRESSION</p><h2>Trophy Road</h2><p className="page-description">Advance throughout three arenas  your academic journey. Milestones require consistent coursework, will you make it to the end?</p></div>
        <div className="road-balance"><span>YOUR TROPHIES</span><strong> {trophies}</strong></div>
      </div>

      <div className="arena-grid">
        {arenas.map((arena) => (
          <article className={`arena-card arena-${arena.theme} ${arena.id === currentArena.id ? "arena-current" : ""}`} key={arena.id}>
            <span className="arena-number">ARENA {arenas.indexOf(arena) + 1}</span>
            <h3>{arena.name}</h3>
            <ArtSlot src={arena.art} label={`${arena.name} art`} className="arena-art" />
            <strong> {arena.range}</strong>
            <p>{arena.subtitle}</p>
          </article>
        ))}
      </div>

      <div className="current-arena-banner">
        <div><span>CURRENT ARENA</span><h3>{currentArena.name}</h3></div>
        <div>{nextArena ? <><span>NEXT ARENA</span><strong>{Math.max(nextArena.min - trophies, 0)} trophies away</strong></> : <><span>FINAL ARENA</span><strong>Keep climbing</strong></>}</div>
      </div>

      <div className="reward-road">
        <div className="road-line" />
        {roadRewards.map((reward, index) => {
          const available = trophies >= reward.threshold;
          const claimed = claimedRewards.includes(reward.id);
          return (
            <article className={`reward-stop ${index % 2 ? "reward-right" : "reward-left"} ${available ? "reward-available" : ""} ${claimed ? "reward-claimed" : ""}`} key={reward.id}>
              <div className="floating-island">
                <ArtSlot src={reward.art} label={reward.title} className="reward-art" />
              </div>
              <div className="reward-copy">
                <span className="reward-type">{reward.type}</span>
                <h3>{reward.title}</h3>
                <p>{reward.description}</p>
                <strong> {reward.threshold}</strong>
                <button disabled={!available || claimed} onClick={() => onClaim(reward)}>{claimed ? "Claimed" : available ? "Claim Reward" : "Locked"}</button>
              </div>
              <div className="road-node">{claimed ? "✓" : available ? "!" : "🔒"}</div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function AvatarScreen({
  avatars,
  selectedAvatarId,
  onSelectAvatar,
}) {
  const selectedAvatar =
    avatars.find((avatar) => avatar.id === selectedAvatarId) ??
    avatars[0];

  return (
    <section className="panel-page">
      <p className="eyebrow">CUSTOMIZATION</p>
      <h2>Choose Your Adventurer</h2>

      <div className="avatar-preview">
        {selectedAvatar.image ? (
          <img
            src={selectedAvatar.image}
            alt={selectedAvatar.name}
            className="avatar-preview-image pixel-art"
          />
        ) : (
          <span className="art-placeholder">?</span>
        )}
      </div>

      <div className="avatar-options">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            disabled={!avatar.image}
            className={
              selectedAvatarId === avatar.id
                ? "avatar-selected"
                : ""
            }
            onClick={() => onSelectAvatar(avatar.id)}
          >
            {avatar.image ? (
              <img
                src={avatar.image}
                alt={avatar.name}
                className="avatar-option-image pixel-art"
              />
            ) : (
              <span className="art-placeholder">?</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function ShopScreen({ trophies, ownedCosmetics, equippedCosmetics, onBuy, onEquip }) {
  return (
    <section className="panel-page">
      <div className="section-heading"><div><p className="eyebrow">COSMETIC SHOP</p><h2>Spend Your Trophies</h2></div><span className="shop-balance"> {trophies}</span></div>
      <p className="page-description">Cosmetics are earned through gameplay and purchased only with trophies (gonna replace this with coins).</p>
      <div className="shop-grid expanded-shop-grid">
        {shopItems.map((item) => {
          const owned = ownedCosmetics.includes(item.id);
          const equipped = equippedCosmetics[item.category] === item.id;
          const affordable = trophies >= item.cost;
          return (
            <article className={`shop-card rarity-${item.rarity.toLowerCase()}`} key={item.id}>
              <ArtSlot src={item.art} label={item.name} className="shop-art" />
              <span className="rarity-label">{item.rarity}</span>
              <h3>{item.name}</h3>
              <p> {item.cost}</p>
              <button disabled={!owned && !affordable} onClick={() => owned ? onEquip(item) : onBuy(item)}>
                {equipped ? "Equipped" : owned ? "Equip" : affordable ? "Buy" : "Need More Trophies"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StatCard({ icon, value, label }) {
  return <div className="stat-card"><span>{icon}</span><strong>{value}</strong><p>{label}</p></div>;
}

function NavButton({ icon, label, active, onClick }) {
  return <button className={`nav-button ${active ? "nav-active" : ""}`} onClick={onClick}><span>{icon}</span>{label}</button>;
}

export default App;