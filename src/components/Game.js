import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useGameContext } from "../components/GameContext";
import socket from "../socket.js";
import "../assets/Game.css";
import "../assets/Coinflip.css";
import "../assets/D20.css";
import D20 from "../D20.js";
import Brothers from "./Brothers";
import DrinkEquation from "./DrinkEquation";
import cardEffects from "./cardEffects";





const shouldGlowSeeAllTarots = (tarots) => {
  const visibleName = tarots[0]?.name;
  return tarots.slice(1).some(card => card.glowing && card.name !== visibleName);
};


const Game = () => {
  const {
    players,
    deck,
    currentPlayerName,
    brothersGraph, setBrothersGraph,
    loversGraph, setLoversGraph,
    drinkEquation,
    setDeck,
    setPlayers,
    setCurrentPlayerName,
    setDrinkEquation,
    isChoosingBrother, setIsChoosingBrother,
    isChoosingLover, setIsChoosingLover,
    isChoosingMediumCard,
    setIsChoosingMediumCard,
    isTranceActive,
    setIsTranceActive,
    cardDrawn, setCardDrawn,
    isTurnEnded, setIsTurnEnded,
    readyToEndTurn, setReadyToEndTurn,
    hasActiveDejaVu, setHasActiveDejaVu,
    isChoosingOuijaCard, setIsChoosingOuijaCard,
    sigilDrawsRemaining, setSigilDrawsRemaining,
    talismanDrawsRemaining, setTalismanDrawsRemaining,
    activePlanets, setActivePlanets,
    glowingPlanetName, setGlowingPlanetName,
    planetGlowKeys, setPlanetGlowKeys,
    isEndOfRound, setIsEndOfRound,
    planetXActive, setPlanetXActive,
    incantationDrawsRemaining, setIncantationDrawsRemaining,
    isEarthDrawPending, setIsEarthDrawPending,
    earthClonePending, setEarthClonePending,

    activeTarots, setActiveTarots,
    selectedTarot, setSelectedTarot,
    seeAllTarotsOpen, setSeeAllTarotsOpen,
    tarotPopupOpen, setTarotPopupOpen,
    tarotGlowKeys, setTarotGlowKeys,
    
    isJokerRound, setIsJokerRound,
    roundNumber, setRoundNumber,
    
    playerOrder, setPlayerOrder,

    jokerGlowKeys, setJokerGlowKeys,


  } = useGameContext();

  

  

  const TurnOrderPanel = ({ players = [], currentPlayerName }) => (
    <div className="turn-order-panel">
      <h3  className="turn-order-title">Ki jön?</h3>
      <ul className="turn-order-list">
        {playerOrder
          .map((playerName) => players.find((p) => p.name === playerName))
          .filter(Boolean)
          .map((player) => (
            <li
              key={player.socketID}
              className={`turn-order-item ${player.name === currentPlayerName ? "current-turn" : ""}`}
            >
              {player.name}
            </li>
          ))}
      </ul>
    </div>
  );

  if (!window.__planetGlowIntervals) {
    window.__planetGlowIntervals = {};
  }

  if (!window.__tarotGlowIntervals) {
    window.__tarotGlowIntervals = {};
  }

  if (!window.__jokerGlowIntervals) {
    window.__jokerGlowIntervals = {};
  }



  const { roomID } = useParams();
  const [mySocketID, setMySocketID] = useState(null);

  const myPlayer = players.find((player) => player.socketID === mySocketID);

  // Cards
  const [allCardMetadata, setAllCardMetadata] = useState([]);

  // Coinflip
  const [coinflipOpen, setCoinflipOpen] = useState(false);
  const [flipResult, setFlipResult] = useState(null);

  // D6 
  const [d6Open, setD6Open] = useState(false);
  const [d6Result, setD6Result] = useState(null);


  // D20
  const [d20Open, setD20Open] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const d20Effect = rollResult ? D20.find(entry => entry.id === rollResult)?.effect : null;

  // Brothers
  const [brothersOpen, setBrothersOpen] = useState(false);

  // Drink Equation
  const [drinkEquationOpen, setDrinkEquationOpen] = useState(false);

  // 9 & lover
  const [chosenBrother, setChosenBrother] = useState("");
  const [brotherModalOpen, setBrotherModalOpen] = useState(false);
  const [forceOpenBrothers, setForceOpenBrothers] = useState(false);
  const [chosenLover, setChosenLover] = useState("");

  const [loverModalOpen, setLoverModalOpen] = useState(false);


  // king counter
  const [kingsRemaining, setKingsRemaining] = useState(4);

  // rules
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [rulesText, setRulesText] = useState("");

  // MEDIUM
  const [selectedColor, setSelectedColor] = useState("Red"); 
  const [selectedCardID, setSelectedCardID] = useState(1);      

  const [mediumModalOpen, setMediumModalOpen] = useState(false);

  // OUIJA
  const [ouijaModalOpen, setOuijaModalOpen] = useState(false);
  const [ouijaCardOptions, setOuijaCardOptions] = useState([]);
  const [selectedOuijaID, setSelectedOuijaID] = useState(null);

  
  const isHost = myPlayer?.isHost;
  const myCards = myPlayer?.cardsDrawn || [];

  // Also OUIJA 
  const lastCard = myPlayer?.cardsDrawn?.[myPlayer.cardsDrawn.length - 1];
  const isWaitingForOuijaClone = lastCard?.id === 65;

  // Dicebag
  const [diceBagOpen, setDiceBagOpen] = useState(false);

  // PLANETs
  const glowRef = useRef();
  glowRef.current = setGlowingPlanetName; // always current
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // EARTH
  const shouldShowEndTurnEarth =
  isEarthDrawPending && !earthClonePending;


  //End of Round feature
  const [endOfRoundOpen, setEndOfRoundOpen] = useState(false);
  const [endOfRoundEntries, setEndOfRoundEntries] = useState([]);

  // TAROTs
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const [onlyOneTarotPopup, setOnlyOneTarotPopup] = useState(false);
  const [onlyOneTarotName, setOnlyOneTarotName] = useState("");

  const seeAllGlowKey = activeTarots
  .slice(1)
  .reduce((acc, card) => acc + (tarotGlowKeys[card.id] || 0), 0);

  // JOKERs
  const [selectedJoker, setSelectedJoker] = useState(null);
  const [arthurModalOpen, setArthurModalOpen] = useState(false);
  const [arthurRollResult, setArthurRollResult] = useState(null);
  const [arthurGifSrc, setArthurGifSrc] = useState(null);
  const isChoosingArthurPath = myPlayer?.effectState?.isChoosingArthurPath;
  const [showResultText, setShowResultText] = useState(false);

  const [staticEndOfRoundEntries, setStaticEndOfRoundEntries] = useState([]);

  const [scaryFaceModalOpen, setScaryFaceModalOpen] = useState(false);
  const [selectedScaryFaceID, setSelectedScaryFaceID] = useState(1);

  const [isChoosingScaryFace, setIsChoosingScaryFace] = useState(false);

  const [isSmearedModalOpen, setIsSmearedModalOpen] = useState(false);
  const [smearedRollHistory, setSmearedRollHistory] = useState([]); // [{ round: 1, result: 4 }]

  const [showBlackboardPopup, setShowBlackboardPopup] = useState(false);
  const [showScholarPopup, setShowScholarPopup] = useState(false);




  



  // Fibonacci
  const [isFibonacciModalOpen, setIsFibonacciModalOpen] = useState(false);
  const [fibInput, setFibInput] = useState('');
  const [fibResult, setFibResult] = useState([]);

  function generateFibonacciUpTo(n) {
    const result = [];
    let a = 0, b = 1;
    while (a <= n) {
      result.push(a);
      [a, b] = [b, a + b];
    }
    return result;
  }

  useEffect(() => {
      if (myPlayer?.name && !socket.connected) {
        console.log("[SOCKET] Setting auth and connecting with playerName:", myPlayer.name);
        socket.auth = { playerName: myPlayer.name };
        socket.connect();
      }
    }, [myPlayer?.name]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    

    socket.emit("getAllCardMetadata", (metadata) => {
      setAllCardMetadata(metadata);
    });


    setMySocketID(socket.id);
    socket.emit("joinGamePage", { roomID });

    socket.on("updateRulesText", (text) => {
      setRulesText(text);
    });

    socket.on("updateGameState", (data) => {
      console.log("[📥 updateGameState] Full payload:", JSON.parse(JSON.stringify(data)));
      const playerList = Object.values(data.players);
      setPlayers(playerList || []);
      setDeck(data.deck || []);
      setActivePlanets(data.activePlanets || []);
      setCurrentPlayerName(data.currentPlayerName || null);
      setKingsRemaining(data.kingsRemaining ?? 4);
      setIsJokerRound(data.isJokerRound ?? false);
      setRoundNumber(data.roundNumber ?? 0);
      setPlayerOrder(data.playerOrder);

      

      if (data.brothersGraph) {
        setBrothersGraph(data.brothersGraph);
      }

      const me = playerList.find(p => p.socketID === socket.id);

      if (me?.joker?.id === 135) {
        console.log(`[CLIENT][SCARY FACE] Your target ID is: ${me.effectState?.scaryFaceTargetID}`);
      }
      console.log(`[CLIENT][DRAWN CARD]`, data.lastDrawnCard);

      setMySocketID(socket.id);

      setActiveTarots(me?.tarots || []);
      setTarotGlowKeys(data.tarotGlowKeys || {});
      setJokerGlowKeys(data.jokerGlowKeys || {});

      Object.entries(data.tarotGlowKeys || {}).forEach(([id, key]) => {
        console.log(`[RECONNECT][CLIENT] Requesting tarot glow for ID ${id} (key=${key})`);
        socket.emit("tarotGlow", { tarotID: Number(id), roomID });
      });

      Object.entries(data.jokerGlowKeys || {}).forEach(([id, key]) => {
        console.log(`[RECONNECT][CLIENT] Requesting joker glow for ID ${id} (key=${key})`);
        socket.emit("jokerGlow", { jokerID: Number(id), roomID });
      });



      if (me?.effectState?.earthClonePending) {
        setIsEarthDrawPending(true);
        setEarthClonePending(true);
      } else {
        setIsEarthDrawPending(false);
        setEarthClonePending(false);
      }

      // ✅ Always set the drawn card from server state
      setCardDrawn(data.lastDrawnCard || null);

      // ✅ Always reset these turn-related flags
      setIsTurnEnded(false);
      setReadyToEndTurn(false);

      if (me?.effectState) {
        setIsChoosingBrother(me.effectState.isChoosingBrother || false);
        setIsChoosingLover(me.effectState.isChoosingLover || false);
        setIsChoosingMediumCard(
          me.effectState.isChoosingMediumCard ?? data.isChoosingMediumCard ?? false
        );
        setIsTranceActive(me.effectState.isTranceActive || false);
        setHasActiveDejaVu(
          me.effectState.hasActiveDejaVu ?? data.hasActiveDejaVu ?? false
        );
        setIsChoosingOuijaCard(
          me.effectState.isChoosingOuijaCard ?? data.isChoosingOuijaCard ?? false
        );
      }


      console.log("[RECONNECT] isChoosingArthurPath:", isChoosingArthurPath);
      console.log("[RECONNECT] isChoosingArthurPath:", data.isChoosingArthurPath);
      console.log("[RECONNECT] cardDrawn:", data.lastDrawnCard);
      console.log("[RECONNECT] currentPlayerName:", data.currentPlayerName);
      console.log("[RECONNECT] myPlayerName:", me?.name);
    });




    socket.on("cardDrawn", ({ drawnCard, newDeck, updatedPlayers, kingsRemaining, nextCard }) => {

      setCardDrawn(drawnCard);
      setDeck(newDeck || []);
      setPlayers(updatedPlayers || []);
      setIsTurnEnded(false);
      setKingsRemaining(kingsRemaining);
      
      const myPlayer = updatedPlayers.find(p => p.socketID === socket.id);

      if (myPlayer?.effectState?.incantationDrawsRemaining !== undefined) {
        setIncantationDrawsRemaining(myPlayer.effectState.incantationDrawsRemaining);
      }

      if (myPlayer?.effectState?.isChoosingLover) {
        socket.emit("chooseLoverPopup", { roomID, playerName: myPlayer.name });
      }

      if (drawnCard?.source === "EARTH") {
        console.log("[EARTH] Earth clone card drawn. Setting flags.");
        setIsEarthDrawPending(true);
        setEarthClonePending(true); // <-- this is the fix
      }





      if (myPlayer && drawnCard?.id && cardEffects[drawnCard.id]) {
        cardEffects[drawnCard.id]({
          player: myPlayer,
          players: updatedPlayers,
          roomID,
          setIsChoosingBrother,
          setIsChoosingLover,
          setIsChoosingMediumCard,
          setIsTranceActive,
          setHasActiveDejaVu,
        });
      }
    });

    

    socket.on("playerDisconnected", ({ playerName }) => {
      alert(`${playerName} disconnected. Waiting for reconnection...`);
    });

    socket.on("playerReconnected", ({ playerName }) => {
      console.log(`${playerName} has reconnected.`);
    });

    socket.on("gameStarted", (data) => {
      setPlayers(data.players || []);
      setDeck(data.deck || []);
      setCurrentPlayerName(data.currentPlayerName || null);
      setCardDrawn(null);
      setIsTurnEnded(false);
    });

    socket.on("updateBrothersGraph", (graph) => {
      console.log("[CLIENT] Received updated brothersGraph:", graph);
      setBrothersGraph({ ...graph }); // 🔁 shallow clone to force re-render
    });

    socket.on("updateLoversGraph", (graph) => {
      console.log("[CLIENT] Received updated loversGraph:", graph);
      setLoversGraph({ ...graph }); // 🔁 shallow clone to force re-render
    });


    socket.on("updateDrinkEquation", (drinkData) => {
      setDrinkEquation({ ...drinkData }); // force shallow clone to trigger re-render
    });

    socket.on("triggerMediumChooseCard", ({ playerName }) => {
      const me = players.find(p => p.socketID === socket.id);
      if (me?.name === playerName) {
        setIsChoosingMediumCard(true);
        const lastCard = me.cardsDrawn?.slice(-1)[0];
        if (lastCard) setCardDrawn(lastCard);
      }
    });

    socket.on("triggerTrance", ({ playerName }) => {
      const me = players.find(p => p.socketID === socket.id);
      if (me?.name === playerName) {
        console.log("[TRANCE] triggerTrance received from server");
        setIsTranceActive(true);
        const lastCard = me.cardsDrawn?.slice(-1)[0];
        if (lastCard) setCardDrawn(lastCard);
      }
    });

    socket.on("triggerChooseBrother", ({ playerName }) => {
      const me = players.find(p => p.socketID === socket.id);
      if (me?.name === playerName) {
        setIsChoosingBrother(true);
        const lastCard = me.cardsDrawn?.slice(-1)[0];
        if (lastCard) setCardDrawn(lastCard);
      }
    });

    socket.on("tranceShuffleComplete", () => {
      setIsTranceActive(false);
      setCardDrawn(null);  // <-- ✅ reset the drawn card
      setReadyToEndTurn(true);  // <-- ✅ show End Turn

    });

    socket.on("triggerDejaVu", ({ playerName }) => {
      const me = players.find(p => p.socketID === socket.id);
      if (me?.name === playerName) {
        setHasActiveDejaVu(true);
        const lastCard = me.cardsDrawn?.slice(-1)[0];
        if (lastCard) {
          console.log("[Déjà Vu] Last card to replay:", lastCard);
          setCardDrawn(lastCard);
        } else {
          console.log("[Déjà Vu] No card to replay, allowing fresh draw.");
          setCardDrawn(null);
          setReadyToEndTurn(true); // fallback draw
        }
      }
    });

    socket.on("triggerOuijaChooseCard", ({ playerName, cardsDrawn }) => {
      const me = players.find(p => p.socketID === socket.id);
      if (me?.name !== playerName) return;

      setIsChoosingOuijaCard(true);
      setOuijaCardOptions(cardsDrawn);  // dropdown now excludes the Ouija card
      const lastCard = me.cardsDrawn.slice(-1)[0];
      if (lastCard) setCardDrawn(lastCard);
    });

    socket.on("triggerSigilDraw", ({ sigilDrawsRemaining }) => {
      setSigilDrawsRemaining(sigilDrawsRemaining);
    });

    socket.on("triggerTalismanDraw", ({ talismanDrawsRemaining }) => {
      setTalismanDrawsRemaining(talismanDrawsRemaining);
    });


    socket.on("planetGlow", ({ planetName }) => {
      if (!planetName) return;

      // 🛠️ Ensure the map exists
      if (!window.__planetGlowIntervals) {
        window.__planetGlowIntervals = {};
      }

      // Clear this planet's existing interval
      if (window.__planetGlowIntervals[planetName]) {
        clearInterval(window.__planetGlowIntervals[planetName]);
      }

      let glowKey = 0;

      // Trigger glow immediately
      setPlanetGlowKeys(prev => ({
        ...prev,
        [planetName]: glowKey,
      }));

      // Loop every 2 seconds
      const interval = setInterval(() => {
        glowKey++;
        setPlanetGlowKeys(prev => ({
          ...prev,
          [planetName]: glowKey,
        }));
      }, 2000);

      window.__planetGlowIntervals[planetName] = interval;
    });

    socket.on("tarotGlow", ({ tarotID }) => {
      console.log(`[CLIENT] Received tarotGlow for ID ${tarotID}`);

      if (!tarotID) return;

      if (!window.__tarotGlowIntervals) {
        window.__tarotGlowIntervals = {};
      }

      if (window.__tarotGlowIntervals[tarotID]) {
        clearInterval(window.__tarotGlowIntervals[tarotID]);
      }

      let glowKey = 0;

      setTarotGlowKeys(prev => ({
        ...prev,
        [tarotID]: glowKey,
      }));

      const interval = setInterval(() => {
        glowKey++;
        setTarotGlowKeys(prev => ({
          ...prev,
          [tarotID]: glowKey,
        }));
      }, 2000);

      window.__tarotGlowIntervals[tarotID] = interval;
    });

    // 🃏 Joker Glow
    socket.on("jokerGlow", ({ jokerID }) => {
      console.log(`[CLIENT] Received jokerGlow for ID ${jokerID}`);

      if (!jokerID) return;

      if (!window.__jokerGlowIntervals) {
        window.__jokerGlowIntervals = {};
      }

      if (window.__jokerGlowIntervals[jokerID]) {
        clearInterval(window.__jokerGlowIntervals[jokerID]);
      }

      let glowKey = 0;

      setJokerGlowKeys(prev => ({
        ...prev,
        [jokerID]: glowKey,
      }));

      const interval = setInterval(() => {
        glowKey++;
        setJokerGlowKeys(prev => ({
          ...prev,
          [jokerID]: glowKey,
        }));
      }, 2000);

      window.__jokerGlowIntervals[jokerID] = interval;
    });

    socket.on("clearPlanetGlow", () => {
      if (window.__planetGlowIntervals) {
        Object.values(window.__planetGlowIntervals).forEach(clearInterval);
        window.__planetGlowIntervals = {};
      }

      setPlanetGlowKeys({});
    });

    socket.on("clearTarotGlow", () => {
      // 🧹 Clear all glow intervals
      if (window.__tarotGlowIntervals) {
        Object.values(window.__tarotGlowIntervals).forEach(clearInterval);
        window.__tarotGlowIntervals = {};
      }

      // Reset glowing state
      setTarotGlowKeys({});
    });

    // 🧹 Joker Glow Clear
    socket.on("clearJokerGlow", () => {
      if (window.__jokerGlowIntervals) {
        Object.values(window.__jokerGlowIntervals).forEach(clearInterval);
        window.__jokerGlowIntervals = {};
      }

      setJokerGlowKeys({});
    });






    socket.on("updateEndOfRound", (status) => {
      console.log("[SOCKET] updateEndOfRound received:", status);
      setIsEndOfRound(status);
    });

    socket.on("updateEarthDrawPending", (value) => {
      setIsEarthDrawPending(value);
    });


    socket.on("planetXShuffleComplete", () => {
      setPlanetXActive(false);
      setCardDrawn(null);

      const canDrawMore =
        myPlayer?.effectState?.incantationDrawsRemaining > 0 ||
        myPlayer?.effectState?.sigilDrawsRemaining > 0 ||
        myPlayer?.effectState?.talismanDrawsRemaining > 0 ||
        isChoosingOuijaCard || 
        hasActiveDejaVu;

      if (canDrawMore) {
        setReadyToEndTurn(false);
      } else {
        setReadyToEndTurn(true);
      }
    });


    socket.on("triggerTarotActivation", ({ card }) => {
      console.log(`🔮 TAROT - Activating ${card.name}`);
      setActiveTarots((prev) => [...prev, card]);
    });

    socket.on("showOnlyOneTarotPopup", ({ cardName }) => {
      setOnlyOneTarotName(cardName);
      setOnlyOneTarotPopup(true);
    });

    socket.on("chooseLoverPopup", ({ roomID, playerName }) => {
      // Set a flag or trigger the popup/button
      setIsChoosingLover(true);
    });

    socket.on("blackboardTarotPopup", () => {
      console.log("[CLIENT] Received blackboardTarotPopup");
      setShowBlackboardPopup(true);
    });

    socket.on("scholarSpectralPopup", () => {
      console.log("[CLIENT] Received scholarSpectralPopup");
      setShowScholarPopup(true);
    });




    socket.on("gameOver", () => {
      alert("No more cards in the deck, GG");
    });

    


    return () => {
      socket.off("updateGameState");
      socket.off("cardDrawn");
      socket.off("playerDisconnected");
      socket.off("playerReconnected");
      socket.off("gameStarted");
      socket.off("updateBrothersGraph");
      socket.off("updateLoversGraph");
      socket.off("updateRulesText");
      socket.off("triggerTrance");
      socket.off("triggerMediumChooseCard");
      socket.off("triggerChooseBrother");
      socket.off("triggerDejaVu");
      socket.off("triggerSigilDraw");
      socket.off("triggerTalismanDraw");
      socket.off("planetGlow");
      socket.off("clearPlanetGlow");
      socket.off("updateEndOfRound");
      socket.off("triggerTarotActivation");
      socket.off("gameOver");
    };
  }, [roomID, setDeck, setPlayers, setCurrentPlayerName, setBrothersGraph, setLoversGraph]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // 🌍 PLANET
      if (
        !e.target.closest(".planet-info-box") &&
        !e.target.closest(".planet-card-image")
      ) {
        setSelectedPlanet(null);
      }

      // 🃏 TAROT
      if (
        !e.target.closest(".tarot-info-box") &&
        !e.target.closest(".tarot-card-image") &&
        !e.target.closest(".tarot-card-image-smaller")
      ) {
        setSelectedTarot(null);
      }

      // 🃏 Also close the TAROT menu panel
      if (
        !e.target.closest(".tarot-panel-row") &&
        !e.target.closest(".see-all-tarots-button") &&
        !e.target.closest(".tarot-card-image-smaller") &&
        !e.target.closest(".tarot-info-box") &&
        !e.target.closest(".tarot-card-image")
      ) {
        setSeeAllTarotsOpen(false);
      }

      // 🃏 JOKER
      if (
        !e.target.closest(".joker-info-box") &&
        !e.target.closest(".joker-card-image")
      ) {
        setSelectedJoker(null);
      }


    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  useEffect(() => {
    const entries = [];

    // 1. PLANET effects
    if (activePlanets.some(card => card.name === "Uranus")) {
      entries.push({
        name: "Uranus",
        text: "Ha valaki kockával dob, annyit iszik, amilyen számot dobott",
        icon: "/CardImages/PLANET/uranus.png"
      });
    }
    if (activePlanets.some(card => card.name === "Venus")) {
      entries.push({
        name: "Venus",
        text: "Minden lány iszik 1-et",
        icon: "/CardImages/PLANET/venus.png"
      });
    }
    if (activePlanets.some(card => card.name === "Jupiter")) {
      entries.push({
        name: "Jupiter",
        text: "Minden fiú iszik 1-et",
        icon: "/CardImages/PLANET/jupiter.png"
      });
    }

    // Wheel of Fortune
    players.forEach((p) => {
      if (p.tarots?.some(card => card.id === 93)) {
        entries.push({
          name: "Wheel of Fortune",
          text: `${p.name} dobjon egyet a D20-al, az effekt kijátszódik`,
          icon: "/CardImages/TAROT/wheel of fortune.png"
        });
      }
    });

    // Hanged Man
    players.forEach((p) => {
      if (p.tarots?.some(card => card.id === 95)) {
        const eq = drinkEquation?.[p.name];
        const sips = Math.round((3 * (eq?.multipliers || 1)) + (eq?.flats || 0));
        entries.push({
          name: "Hanged Man",
          text: `${p.name} iszik ${sips} kortyot`,
          icon: "/CardImages/TAROT/hanged man.png"
      });
    }});

    // Fool
    players.forEach((p) => {
      if (p.tarots?.some(card => card.id === 83)) {
        const eq = drinkEquation[p.name] || { multipliers: 1, flats: 0 };
        const result = Math.max(0, 2 * eq.multipliers + eq.flats);

        entries.push({
          name: "Fool",
          text: `${p.name} feldob egy érmét, ha fejet dob, iszik ${result} kortyot`,
          icon: "/CardImages/TAROT/fool.png"
        });
      }
    });

    // Judgement
    players.forEach((p) => {
      if (p.tarots?.some(card => card.id === 103)) {
        entries.push({
          name: "Judgement",
          text: `Ha ${p.name} ivott ebben a körben, kioszthat 5 kortyot`,
          icon: "/CardImages/TAROT/judgement.png"
        });
      }
    });

    // JOKERS

    // Jolly Joker (Joker)
    players.forEach((p) => {
      if (p.joker?.id === 109) {
        entries.push({
          name: "Jolly Joker",
          text: `Ha bárki kockával dob, ${p.name} kioszt 1 kortyot`,
          icon: "/CardImages/JOKER/jolly joker.png",
        });
      }
    });
    // Joker (End of Round)
    players.forEach((p) => {
      if (p.joker?.id === 105) {
        entries.push({
          name: "Joker",
          text: `${p.name} dob egy D20-al, ha 20-ast dob, kioszt egy egész italt`,
          icon: "/CardImages/JOKER/joker.png",
        });
      }
    });

    // Greedy Joker (End of Round)
    players.forEach((p) => {
      if (p.joker?.id === 106) {
        entries.push({
          name: "Greedy Joker",
          text: `Ha a körben ${p.name} itta a legtöbbet, kioszt 10 kortyot, ha a legkevesebbet, akkor iszik 5-öt `,
          icon: "/CardImages/JOKER/greedy joker.png",
        });
      }
    });

    // 🃏 Mad Joker end-of-round entry
    players.forEach((p) => {
      if (p.joker?.id === 110) {
        entries.push({
          name: "Mad Joker",
          text: `Ha ${p.name} a körben 5-nél több kortyot ivott, iszik még 5-öt és kioszt 10-et, akármilyen felosztásban`,
          icon: "/CardImages/JOKER/mad joker.png"
        });
      }
    });

    // 🃏 Crazy Joker end-of-round entry
    players.forEach((p) => {
      if (p.joker?.id === 111) {
        entries.push({
          name: "Crazy Joker",
          text: `${p.name} dob egy D6-al, ha 6-ot dob, valaki italába rakhat akármit, ha mást, iszik 3-at`,
          icon: "/CardImages/JOKER/crazy joker.png"
        });
      }
    });

    // 🃏 Devious Joker end-of-round entry
    players.forEach((p) => {
      if (p.joker?.id === 112) {
        entries.push({
          name: "Devious Joker",
          text: `${p.name} dob egy D20-al, majd annyi kortyot kioszt valakinek ahányat dobott`,
          icon: "/CardImages/JOKER/devious joker.png"
        });
      }
    });

    // 🃏 The Baron end-of-round entry
    players.forEach((p) => {
      if (p.joker?.id === 124) {
        entries.push({
          name: "The Baron",
          text: `${p.name} dob egy D6-al, ha 6-ost dob, egy általa válaszott játékos iszik helyette a következő kör végéig, ha 1-est, iszik 5-öt`,
          icon: "/CardImages/JOKER/the baron.png"
        });
      }
    });

    // 🃏 Brainstorm end-of-round entry
    players.forEach((p) => {
      if (p.joker?.id === 131) {
        entries.push({
          name: "Brainstorm",
          text: `${p.name} dob egy D20-al, ha 20-ast dob, kitalálhat egy új szabályt`,
          icon: "/CardImages/JOKER/brainstorm.png"
        });
      }
    });

    // 🃏 Burnt Joker end-of-round entry
    players.forEach((p) => {
      if (p.joker?.id === 132) {
        entries.push({
          name: "Burnt Joker",
          text: `${p.name} feldob egy érmét, ha fej, annyit iszik ahányadik kör van, ha írás, annyit kioszt`,
          icon: "/CardImages/JOKER/burnt joker.png"
        });
      }
    });

    // The Drunkard
    players.forEach((p) => {
      if (p.joker?.id === 126) {
        const eq = drinkEquation?.[p.name];
        const sips = Math.round((3 * (eq?.multipliers || 1)) + (eq?.flats || 0));
        entries.push({
          name: "The Drunkard",
          text: `${p.name} iszik ${sips} kortyot`,
          icon: "/CardImages/JOKER/the drunkard.png"
      });
    }});

    // Merry Andy (Joker ID 149)
    players.forEach((p) => {
      if (p.joker?.id === 149) {
        const eq = drinkEquation[p.name] || { multipliers: 1, flats: 0 };
        const baseAmount = players.length * 3;
        const total = Math.max(0, baseAmount * eq.multipliers + eq.flats);

        entries.push({
          name: "Merry Andy",
          text: `Ha ${p.name} nem ivott ebben a körben, akkor iszik ${total} kortyot`,
          icon: "/CardImages/JOKER/merry andy.png"
        });
      }
    });

    // Hiker (Joker ID 138)
    players.forEach((p) => {
      if (p.joker?.id === 138) {
        console.log(`[HIKER ENDROUND] ${p.name} has Hiker. Current count: ${p.effectState.hikerCount || 0}`);
        const count = (p.effectState.hikerCount || 0) + 1;


        entries.push({
          name: "Hiker",
          text: `${p.name} következő itala ${count} alapanyagból kell hogy készüljön`,
          icon: "/CardImages/JOKER/hiker.png"
        });
      }
    });



        



    setEndOfRoundEntries([...entries, ...staticEndOfRoundEntries]);
  }, [activePlanets, players, activeTarots, drinkEquation]);


  useEffect(() => {
    socket.on("endOfRoundEntries", (newEntries) => {
      setStaticEndOfRoundEntries((prev) => [...prev, ...newEntries]);
    });

    return () => {
      socket.off("endOfRoundEntries");
    };
  }, []);

  useEffect(() => {
    socket.on("triggerScaryFaceChoose", ({ roomID, playerName }) => {
      if (myPlayer?.name === playerName) {
        setIsChoosingScaryFace(true);
      }
    });
  }, [myPlayer]);

  useEffect(() => {
    socket.on("triggerPlanetXShuffle", ({ roomID }) => {
      setPlanetXActive(true); // triggers special shuffle UI
    });

    return () => {
      socket.off("triggerPlanetXShuffle");
    };
  }, []);

  useEffect(() => {
    socket.on("updateSmearedRolls", (rolls) => {
      console.log("[CLIENT] Received smeared rolls:", rolls);
      setSmearedRollHistory(rolls);
    });

    return () => {
      socket.off("updateSmearedRolls");
    };
  }, [socket]);


  




  if (!mySocketID) return <div>Loading game...</div>;

  

  const drawACard = () => {
    if (cardDrawn || myPlayer?.name !== currentPlayerName)
      return;
    
    // ✅ Reset end of round glow on first draw of new round
    setIsEndOfRound(false);
    socket.emit("drawCard", { roomID, cause: "normal" });
  };

  const endTurn = () => {
    if (myPlayer?.name !== currentPlayerName) return;

    if (hasActiveDejaVu) {
      setHasActiveDejaVu(false); // reset the flag
      setCardDrawn(null);        // clear the "replayed" card
      setReadyToEndTurn(false);  // show draw button again
      return; // ⛔ don't emit endTurn yet
    }

    


    setCardDrawn(null);
    setIsTurnEnded(true);
    setReadyToEndTurn(false);
    
    if (window.__planetGlowIntervals) {
      Object.values(window.__planetGlowIntervals).forEach(clearInterval);
      window.__planetGlowIntervals = {};
    }
    setPlanetGlowKeys({});

    setGlowingPlanetName(null);

    // ✅ If this player is last in turn order
    const playerNamesInOrder = players.map(p => p.name);
    const isLastPlayer = playerNamesInOrder[playerNamesInOrder.length - 1] === myPlayer.name;
    if (isLastPlayer) {
      setIsEndOfRound(true);
    }

    setIsEarthDrawPending(false); // Reset manually just in case


    socket.emit("endTurn", { roomID });
  };

  const endTurnEarth = () => {
    if (myPlayer?.name !== currentPlayerName) return;

    

    setIsEarthDrawPending(false);
    setEarthClonePending(false);
    setCardDrawn(null);
    setIsTurnEnded(true);
    setReadyToEndTurn(false);

    if (window.__planetGlowIntervals) {
      Object.values(window.__planetGlowIntervals).forEach(clearInterval);
      window.__planetGlowIntervals = {};
    }

    setPlanetGlowKeys({});
    setGlowingPlanetName(null);

    const playerNamesInOrder = players.map(p => p.name);
    const isLastPlayer = playerNamesInOrder[playerNamesInOrder.length - 1] === myPlayer.name;
    if (isLastPlayer) {
      setIsEndOfRound(true);
    }

    

    socket.emit("endTurnEarth", { roomID });
  };



  // Coinflip handlers
  const openCoinflip = () => {
    setFlipResult(null);
    setCoinflipOpen(true);
  };
  const closeCoinflip = () => setCoinflipOpen(false);
  const flipCoin = () => setFlipResult(Math.floor(Math.random() * 2));

  // D20 handlers
  const openD20 = () => {
    setRollResult(null);
    setD20Open(true);
  };
  const closeD20 = () => setD20Open(false);
  const rollD20 = () => setRollResult(Math.floor(Math.random() * 20) + 1);

  const openD6 = () => {
    setD6Result(null);
    setD6Open(true);
  };

  const closeD6 = () => setD6Open(false);

  const rollD6 = () => {
    const result = Math.floor(Math.random() * 6) + 1; // 1 to 6
    setD6Result(result);
  };

  const containerWidth = 600;
  const cardWidth = 100;
  const totalCards = myCards.length;
  let spacing = cardWidth;

  if (totalCards > 1) {
    spacing = Math.min(
      (containerWidth - cardWidth) / (totalCards - 1),
      cardWidth - 20
    );
  }

  const handleRulesChange = (e) => {
    const newText = e.target.value;
    setRulesText(newText);
    socket.emit("updateRulesText", { roomID, text: newText });
  };

  const handleTranceShuffle = () => {
    socket.emit("tranceShuffleCards", {
      roomID,
      playerName: myPlayer?.name,
    });
    setIsTranceActive(false);      // ✅ hide Shuffle
    setReadyToEndTurn(true);       // ✅ show End Turn
    setCardDrawn(null);            // ✅ hide the old Trance card
  };

  const handleArthurChoice = (becameJoker) => {
    socket.emit("arthurPathChosen", {
      roomID,
      playerName: myPlayer.name,
      didBecomeJoker: becameJoker,
    });
    setArthurModalOpen(false);
  };



  
  const isHermit = myPlayer?.tarots?.some(card => card.id === 92);

  
  

  return (
    <div className="game-container">
      <h1 className="game-title">
        {isJokerRound ? "Joker Round" : `Round ${roundNumber}`}
      </h1>


      <div className="card-container">
        {cardDrawn ? (
          <>
            <p className="card-text">
              {currentPlayerName} drew {cardDrawn.name}!
            </p>
            <img
              src={cardDrawn.src}
              className="drawn-card"
              alt={cardDrawn.name}
            />
            <div className="effect-container">
              <p className="effect-text">
                <strong>Effect:</strong> {cardDrawn.effect || "No effect for now"}
              </p>
              {cardDrawn?.source && (
                <p className="source-text">
                  Source: {cardDrawn.source}
                </p>
              )}

            </div>

          </>
        ) : (
          <img
            src="/CardImages/cardbacks/BlackBack.png"
            className="drawn-card cardback"
            alt="Card Back"
          />
        )}
      </div>
    
      {players.length > 0 &&
        currentPlayerName &&
        myPlayer?.name === currentPlayerName && (
          <>
            {(() => {
              

               // 🌍 EARTH logic
              if (isEarthDrawPending) {
                if (cardDrawn === null) {
                  return (
                    <button className="floating-button" onClick={drawACard}>
                      Draw (Earth)
                    </button>
                  );
                } else {
                  return (
                    <button className="floating-button" onClick={endTurnEarth}>
                      End Turn (Earth)
                    </button>
                  );
                }
              }


              if (cardDrawn === null && !readyToEndTurn) {
                if (myPlayer?.effectState?.sigilDrawsRemaining > 0) {
                  return (
                    <button className="floating-button" onClick={drawACard}>
                      Draw ({3 - myPlayer.effectState.sigilDrawsRemaining}/2)
                    </button>
                  );
                } else if (myPlayer?.effectState?.talismanDrawsRemaining > 0) {
                  return (
                    <button className="floating-button" onClick={drawACard}>
                      Draw ({3 - myPlayer.effectState.talismanDrawsRemaining}/2)
                    </button>
                  );
                } else {
                  const lastCard = myPlayer?.cardsDrawn?.[myPlayer.cardsDrawn.length - 1];
                  const isWaitingForOuijaClone = lastCard?.id === 65;

                  if (
                    isWaitingForOuijaClone ||
                    myPlayer?.effectState?.hasActiveDejaVu ||
                    isChoosingOuijaCard
                  ) {
                    return (
                      <button className="floating-button" onClick={drawACard}>
                        Draw Card
                      </button>
                    );
                  } else if (
                    myPlayer?.effectState?.incantationDrawsRemaining > 0 ||
                    myPlayer?.effectState?.incantationDrawsRemaining === 5
                  ) {
                    return (
                      <button className="floating-button" onClick={drawACard}>
                        Draw ({6 - incantationDrawsRemaining}/5)
                      </button>
                    );
                  } else {
                    return (
                      <button className="floating-button" onClick={drawACard}>
                        {isJokerRound ? "Draw Joker" : "Draw Card"}
                      </button>
                    );
                  }
                }
                } else if (isChoosingBrother) {
                  return (
                    <button className="floating-button" onClick={() => setBrotherModalOpen(true)}>
                      Choose Brother
                    </button>
                  );
                } else if (isChoosingLover) {
                  return (
                    <button className="floating-button" onClick={() => setLoverModalOpen(true)}>
                      Choose Lover
                    </button>
                  );
                } else if (isChoosingMediumCard) {
                  return (
                    <button className="floating-button" onClick={() => setMediumModalOpen(true)}>
                      Choose Card
                    </button>
                  );
                } else if (isTranceActive) {
                  return (
                    <button className="floating-button" onClick={handleTranceShuffle}>
                      Shuffle
                    </button>
                  );
                } else if (isChoosingOuijaCard) {
                  return (
                    <button className="floating-button" onClick={() => setOuijaModalOpen(true)}>
                      Choose Card
                    </button>
                  );
                } else if (planetXActive) {
                  return (
                    <button
                      className="floating-button"
                      onClick={() => {
                        socket.emit("planetXShuffle", { roomID, playerName: myPlayer.name });
                        setPlanetXActive(false);
                      }}
                    >
                      Shuffle
                    </button>
                  );
                } else if (isChoosingArthurPath) {
                return (
                  <button className="floating-button" onClick={() => setArthurModalOpen(true)}>
                    Choose Path
                  </button>
                );
                } else if (isChoosingScaryFace) {
                  return (
                    <button className="floating-button" onClick={() => setScaryFaceModalOpen(true)}>
                      Choose Card
                    </button>
                  );
                } else {
                  return (
                    <button className="floating-button" onClick={endTurn}>
                      End Turn
                    </button>
                  );
                }
            })()}
          </>
      )}


      <div className="turn-order-container">
        <TurnOrderPanel
          players={players}
          currentPlayerName={currentPlayerName}
        />
      </div>
      {/* Brothers Button (below Turn Order) */}
      <button className="brothers-button" onClick={() => setBrothersOpen(true)} title="Manage Brothers">
        <img src="/Icons/brothers.png" alt="Brothers" className="brothers-icon" />
      </button>

      <button
        className={`endofround-button ${isEndOfRound ? "endofround-glow" : ""}`}
        onClick={() => setEndOfRoundOpen(true)}
        title="End of Round Actions"
      >
        <img src="/Icons/endofround.png" alt="End of Round" className="dicebag-icon" />
      </button>



      <button
        className="drink-equation-button"
        onClick={() => setDrinkEquationOpen(true)}
        title="Drink Equation"
      >
        <img src="/Icons/drink2.png" alt="Drink Equation" className="drink-equation-icon" />
      </button>

      <button className="rules-button" onClick={() => setRulesModalOpen(true)} title="Rules">
        <img src="/Icons/rules.png" alt="Rules" className="rules-icon" />
      </button>


      {/* Dice bag Button (replaces Coinflip and D20) */}
      <button className="dicebag-button" onClick={() => setDiceBagOpen(prev => !prev)} title="Dice Bag">
        <img src="/Icons/dicebag.png" alt="Dice Bag" className="dicebag-icon" />
      </button>



      {/* Coinflip Modal */}
      {coinflipOpen && (
        <div className="coinflip-modal-overlay">
          <div className="coinflip-modal">
            <button className="coinflip-close-button" onClick={closeCoinflip}>
              ×
            </button>
            {flipResult === null ? (
              <button className="coinflip-flip-button pixel-font" onClick={flipCoin}>
                Flip
              </button>
            ) : (
              <div className="coinflip-gif-container">
                <img
                  src={flipResult === 0 ? "/rollgifs/heads.gif" : "/rollgifs/tails.gif"}
                  alt={flipResult === 0 ? "Heads" : "Tails"}
                  className="coinflip-gif"
                />
                <div className="coinflip-result-overlay">
                  {flipResult === 0 ? "Fej" : "Írás"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {d6Open && (
        <div className="d20-modal-overlay">
          <div className="d20-modal">
            <button className="d20-close-button" onClick={closeD6}>×</button>
            {d6Result === null ? (
              <button className="d20-roll-button pixel-font" onClick={rollD6}>
                Roll
              </button>
            ) : (
              <div className="d20-gif-container">
                <img
                  src={`/rollgifs/diceroll${d6Result}.gif`}
                  alt={`Rolled ${d6Result}`}
                  className="d20-gif"
                />
                <div className="d20-result-overlay">{d6Result}</div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* D20 Modal */}
      {d20Open && (
        <div className="d20-modal-overlay">
          <div className="d20-modal">
            <button className="d20-close-button" onClick={closeD20}>
              ×
            </button>
            {rollResult === null ? (
              <button className="d20-roll-button pixel-font" onClick={rollD20}>
                Roll
              </button>
            ) : (
              <>
                <div className="d20-gif-container">
                  <img src="/rollgifs/d20.gif" alt="Rolling D20" className="d20-gif" />
                  <div className="d20-result-overlay">{rollResult}</div>
                </div>
                {d20Effect && (
                  <p className="d20-effect-text pixel-font">Effect: {d20Effect}</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {endOfRoundOpen && (
        <div className="endofround-modal-overlay" onClick={() => setEndOfRoundOpen(false)}>
          <div className="endofround-modal" onClick={e => e.stopPropagation()}>
            <button className="endofround-close-button" onClick={() => setEndOfRoundOpen(false)}>
              ×
            </button>
            <h3 className="endofround-title">End of Round Actions</h3>
            {endOfRoundEntries.length === 0 ? (
              <p className="endofround-empty-text">No end-of-round effects are currently active.</p>
            ) : (
              <ul className="endofround-list">
                {endOfRoundEntries.map(({ name, text, icon }, idx) => (
                  <li key={idx} className="endofround-list-item">
                    {icon && <img src={icon} alt={name} className="endofround-icon-image" />}
                    <div className="endofround-text"><strong>{name}:</strong> {text}</div>
                  </li>
                ))}
              </ul>

            )}
          </div>
        </div>
      )}



      {diceBagOpen && (
        <div
          className="dicebag-menu-overlay"
          onClick={() => setDiceBagOpen(false)}
        >
          <div
            className="dicebag-menu-horizontal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="dice-option-button"
              onClick={() => {
                setDiceBagOpen(false);
                openCoinflip();
              }}
            >
              <img src="/Icons/cflip.png" alt="Coinflip" className="dice-icon" />
            </button>
            <button
              className="dice-option-button"
              onClick={() => {
                setDiceBagOpen(false);
                openD6();
              }}
            >
              <img src="/Icons/d6.png" alt="D6" className="dice-icon" />
            </button>
            <button
              className="dice-option-button"
              onClick={() => {
                setDiceBagOpen(false);
                openD20();
              }}
            >
              <img src="/Icons/d20.png" alt="D20" className="dice-icon" />
            </button>
          </div>
        </div>
      )}




      {brotherModalOpen && (
        <div className="brother-modal-overlay">
          <div className="brother-modal">
            <h3>Pick a brother</h3>
            {isHermit ? (
              <p style={{ color: "#888", marginBottom: "1em" }}>A Hermit can't have brothers :(</p>
            ) : (
              <select
                value={chosenBrother}
                onChange={(e) => setChosenBrother(e.target.value)}
                className="brother-dropdown"
              >
                <option value="">- Pick -</option>
                {players
                  .filter((p) => {
                    if (p.name === myPlayer.name) return false;
                    const myLover = loversGraph?.[myPlayer.name]?.[0];
                    const isTargetHermit = p.tarots?.some((t) => t.id === 92);
                    return p.name !== myLover && !isTargetHermit;
                  })
                  .map((p) => (
                    <option key={p.socketID} value={p.name}>
                      {p.name}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={() => {
                if (isHermit || !chosenBrother) {
                  setBrotherModalOpen(false);
                  setIsChoosingBrother(false);
                  setChosenBrother("");
                  setReadyToEndTurn(true);
                  setCardDrawn(null);
                  return;
                }

                const alreadyConnected =
                  players &&
                  players.length > 0 &&
                  players.some(
                    (p) =>
                      p.name === myPlayer.name &&
                      brothersGraph?.[p.name]?.includes(chosenBrother)
                  );

                if (!alreadyConnected) {
                  setForceOpenBrothers(true);
                  socket.emit("addBrotherConnection", {
                    roomID,
                    sourceName: myPlayer.name,
                    targetName: chosenBrother,
                  });
                }

                setBrotherModalOpen(false);
                setIsChoosingBrother(false);
                setChosenBrother("");
                setReadyToEndTurn(true);
                setCardDrawn(null);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

  
      {loverModalOpen && (
        <div className="brother-modal-overlay">
          <div className="brother-modal">
            <h3>Pick a lover</h3>
            {isHermit ? (
              <p style={{ color: "#888", marginBottom: "1em" }}>A Hermit can't have lovers :(</p>
            ) : (
              <select
                value={chosenLover}
                onChange={(e) => setChosenLover(e.target.value)}
                className="brother-dropdown"
              >
                <option value="">- Pick -</option>
                {players
                  .filter((p) => {
                    const currentLovers = loversGraph?.[myPlayer.name] || [];
                    const isTargetHermit = p.tarots?.some((t) => t.id === 92);
                    const isTargetBlackboard = (p.joker?.id === 119);
                    return p.name !== myPlayer.name && !currentLovers.includes(p.name) && !isTargetHermit && !isTargetBlackboard;
                  })
                  .map((p) => (
                    <option key={p.socketID} value={p.name}>
                      {p.name}
                    </option>
                  ))}
              </select>
            )}

            <button
              onClick={() => {
                if (isHermit || !chosenLover) {
                  setLoverModalOpen(false);
                  setIsChoosingLover(false);
                  setChosenLover("");
                  setReadyToEndTurn(true);
                  setCardDrawn(null);
                  return;
                }

                const roomID = window.location.pathname.split("/").pop();

                socket.emit("addLoverConnection", {
                  roomID,
                  sourceName: myPlayer.name,
                  targetName: chosenLover,
                });

                setLoverModalOpen(false);
                setIsChoosingLover(false);
                setChosenLover("");
                setReadyToEndTurn(true);
                setCardDrawn(null);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {arthurModalOpen && (
        <div className="arthur-modal-overlay">
          <div className="arthur-modal-backdrop">
            <div className="arthur-modal-content">
              <h2 className="arthur-modal-title">Will Arthur become the Joker?</h2>

              {!arthurRollResult ? (
                <button
                  className="arthur-modal-button"
                  onClick={() => {
                    const roll = Math.floor(Math.random() * 6) + 1;
                    setArthurRollResult(roll);
                    setArthurGifSrc(`/rollgifs/diceroll${roll}.gif`);
                    setShowResultText(false); // reset in case of re-roll

                    setTimeout(() => {
                      setShowResultText(true);
                    }, 1340); //  delay
                  }}

                >
                  Find Out
                </button>
              ) : (
                <>
                  <img  className = "arthur-roll-gif" src={arthurGifSrc} alt={`Rolled ${arthurRollResult}`} />
                  {showResultText && (
                    <>
                      <p className="arthur-result-text">
                        {arthurRollResult === 6
                          ? "Arthur became the Joker."
                          : "Arthur made some new friends in prison."}
                      </p>
                      <button
                        className="arthur-modal-button"
                        onClick={() => {
                          handleArthurChoice(arthurRollResult === 6);
                          setArthurRollResult(null);
                          setArthurGifSrc(null);
                          setShowResultText(false);
                        }}
                      >
                        OK
                      </button>

                    </>
                  )}
                </>

              )}
            </div>
          </div>
        </div>
      )}

      {scaryFaceModalOpen && (
        <div className="brother-modal-overlay">
          <div className="brother-modal">
            <h3>Choose a card</h3>

            <select
              className="brother-dropdown"
              value={selectedScaryFaceID}
              onChange={(e) => setSelectedScaryFaceID(Number(e.target.value))}
              style={{ height: "30px", overflowY: "auto" }} // 👈 makes it scrollable
            >
              {allCardMetadata
                .filter(card => card.id >= 1 && card.id <= 52)
                .map(card => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
                ))}
            </select>

            <button
              onClick={() => {
                socket.emit("scaryFaceCardChosen", {
                  roomID,
                  playerName: myPlayer.name,
                  chosenCardID: selectedScaryFaceID,
                });

                setScaryFaceModalOpen(false);
                setIsChoosingScaryFace(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {isSmearedModalOpen && (
        <div className="smeared-modal-overlay" onClick={() => setIsSmearedModalOpen(false)}>
          <div className="smeared-modal" onClick={(e) => e.stopPropagation()}>
            <div className="smeared-history">
              <h3>Roll History</h3>
              {smearedRollHistory.length === 0 ? (
                <p>No rolls yet.</p>
              ) : (
                <>
                  <ul>
                    {smearedRollHistory.map(entry => (
                      <li key={entry.round}>Round {entry.round} - {entry.result}</li>
                    ))}
                  </ul>

                  <hr className="smeared-divider" />

                  <div className="smeared-sum" style={{
                    color: smearedRollHistory.reduce((sum, e) => sum + e.result, 0) >= 50 ? "red" : "inherit",
                    fontWeight: smearedRollHistory.reduce((sum, e) => sum + e.result, 0) >= 50 ? "bold" : "normal"
                  }}>
                    {smearedRollHistory.reduce((sum, e) => sum + e.result, 0) >= 50
                      ? `THE TIME HAS COME ${smearedRollHistory.reduce((sum, e) => sum + e.result, 0)}/50`
                      : `${smearedRollHistory.reduce((sum, e) => sum + e.result, 0)}/50`}
                  </div>
                </>
              )}
            </div>

            <div className="smeared-roll-buttons">
              {(() => {
                const unrolledRounds = Array.from({ length: roundNumber }, (_, i) => i + 1)
                  .filter(round => !smearedRollHistory.some(entry => entry.round === round));
                const nextUnrolledRound = unrolledRounds[0];
                return nextUnrolledRound ? (
                  <button
                    onClick={() => {
                      const result = Math.floor(Math.random() * 6) + 1;
                      socket.emit("smearedRoll", { round: nextUnrolledRound, result });
                    }}
                    className="smeared-roll-button"
                  >
                    Roll Round {nextUnrolledRound}
                  </button>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}



      

      {myPlayer?.joker?.id === 116 && (
  <>
          {isFibonacciModalOpen && (
            <div className="fibonacci-modal-overlay">
              <div className="fibonacci-modal-box">
                <h2 className="fibonacci-title">Fibonacci Calculator</h2>

                <input
                  type="number"
                  placeholder="Enter a number"
                  value={fibInput}
                  onChange={(e) => setFibInput(e.target.value)}
                  className="fibonacci-input"
                />

                <button
                  className="fibonacci-button"
                  onClick={() => {
                    const n = parseInt(fibInput);
                    if (!isNaN(n)) {
                      setFibResult(generateFibonacciUpTo(n));
                    }
                  }}
                >
                  Calculate
                </button>

                {fibResult.length > 0 && (
                  <div className="fibonacci-output">
                    <p className="fibonacci-sequence">
                      Sequence: {fibResult.join(', ')}
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setIsFibonacciModalOpen(false);
                    setFibInput('');
                    setFibResult([]);
                  }}
                  className="fibonacci-close-button"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {brothersOpen && (
        <div className="brothers-modal-overlay">
          <div className="brothers-modal">
            <button className="brothers-close-button" onClick={() => setBrothersOpen(false)}>
              ×
            </button>
            <Brothers />
          </div>
        </div>
      )}

      {drinkEquationOpen && (
        <div className="drink-equation-modal-overlay">
          <div className="drink-equation-modal">
            <button
              className="drink-equation-close-button"
              onClick={() => setDrinkEquationOpen(false)}
            >
              ×
            </button>
            <DrinkEquation />
          </div>
        </div>
      )}

      




      {rulesModalOpen && (
        <div className="rules-modal-overlay">
          <div className="rules-modal">
            <button className="rules-close-button" onClick={() => setRulesModalOpen(false)}>×</button>
            <h3>Rules</h3>
            {isHost ? (
              <textarea
                value={rulesText}
                onChange={(e) => {
                  const newText = e.target.value;
                  setRulesText(newText);
                  socket.emit("updateRulesText", { roomID, text: newText });
                }}
                placeholder="Type rules here..."
                className="rules-textarea"
                rows={10}
              />
            ) : (
              <div className="rules-display-box">{rulesText || "No rules set."}</div>
            )}
          </div>
        </div>
      )}

      {mediumModalOpen && (
        <div className="brother-modal-overlay">
          <div className="brother-modal">
            <h3>Choose a card</h3>

            {/* Color Selector */}
            <select
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                // Reset selected card when color changes
                setSelectedCardID(e.target.value === "Black" ? 1 : 14);
              }}
              className="brother-dropdown"
              style={{ marginBottom: "10px" }}
            >
              <option value="Black">Black</option>
              <option value="Red">Red</option>
            </select>

            {/* Card Selector */}
            <select
              value={selectedCardID}
              onChange={(e) => setSelectedCardID(Number(e.target.value))}
              className="brother-dropdown"
            >
              {allCardMetadata
                .filter(card => {
                  if (selectedColor === "Black") return card.id >= 1 && card.id <= 13;
                  if (selectedColor === "Red") return card.id >= 14 && card.id <= 26;
                  return false;
                })
                .map(card => (
                  <option key={card.id} value={card.id}>
                    {card.name.replace(/^[^\w]+/, "")}
                  </option>
                ))}
            </select>

            <p style={{ marginTop: "10px", fontSize: "14px", color: "#555" }}>
              Note: 3 copies of the chosen card will be shuffled into the deck.
            </p>

            <button
              onClick={() => {
                socket.emit("addCardCopiesToDeck", {
                  roomID,
                  cardID: selectedCardID,
                  count: 3,
                  sourcePlayer: myPlayer?.name || "Unknown",
                });
                setMediumModalOpen(false);
                setIsChoosingMediumCard(false);
                setSelectedCardID(selectedColor === "Black" ? 1 : 14);
                setCardDrawn(null);
                setReadyToEndTurn(true);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}


      {ouijaModalOpen && (
        <div className="brother-modal-overlay">
          <div className="brother-modal">
            <h3>Choose a card to replay</h3>
            <select
              value={selectedOuijaID}
              onChange={(e) => setSelectedOuijaID(Number(e.target.value))}
              className="brother-dropdown"
            >
              <option value="">- Select a card -</option>
              {ouijaCardOptions
                .filter(card => card.id !== 65) // ⛔ Exclude Ouija itself
                .map(card => (
                  <option key={card.id} value={card.id}>
                    {card.name}
                  </option>
              ))}
            </select>
            <button
              onClick={() => {
                if (!selectedOuijaID) return;

                socket.emit("confirmOuijaChoice", {
                  roomID,
                  playerName: myPlayer?.name,
                  cardID: selectedOuijaID,
                });

                setOuijaModalOpen(false);
                setIsChoosingOuijaCard(false);
                setCardDrawn(null);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}









      <div className="my-cards-container">
        {myCards.map((card, index) => {
          const containerWidth = 500;
          const cardWidth = 80;
          const baseSpacing = cardWidth;
          const overlapThreshold =
            totalCards > Math.floor(containerWidth / cardWidth);

          const spacing = overlapThreshold
            ? Math.min(
                baseSpacing,
                (containerWidth - cardWidth) / (totalCards - 1)
              )
            : baseSpacing;

          return (
            <img
              key={index}
              src={card.src}
              alt={card.name}
              className="my-card"
              style={{
                position: "absolute",
                left: `${index * spacing}px`,
              }}
            />
          );
        })}
      </div>

      <div className="king-counter">
        <img
          src={`/CardImages/kingCounters/kingCounter${Math.min(kingsRemaining, 10)}.png`}
          className="king-counter-image"
        />
      </div>

      <div className="planet-panel">
        <h3 className="planet-panel-title">Planets</h3>
        {[0, 1].map((slot) => {
          const planet = activePlanets[slot];
          return (
            <div key={slot} className="planet-slot" style={{ position: "relative" }}>
              {planet ? (
                <img
                  key={`${planet.name}-${planetGlowKeys[planet.name] ?? 0}`}  // 🔁 dynamic key
                  src={planet.src}
                  alt={planet.name}
                  className={`planet-card-image ${planetGlowKeys[planet.name] !== undefined ? "planet-glow" : ""}`}
                  onClick={() => setSelectedPlanet(planet)}
                  style={{ cursor: "pointer" }}
                />

              ) : (
                <div className="planet-card-placeholder" />
              )}

              {planet && selectedPlanet?.id === planet.id && (
                <div className="planet-info-box">
                  <strong>{planet.name}:</strong> {planet.effect || "No effect."}
                </div>
              )}

            </div>
          );
        })}

      </div>

      <div className="tarot-panel">
        <div className="tarot-panel-inner">
          {/* Left column: main tarot slot + title + see-all button */}
          <div className="tarot-panel-column">
            <h3 className="tarot-panel-title">Tarots</h3>

            <div className="tarot-slot">
              {activeTarots.length > 0 ? (
                <img
                  key={`${activeTarots[0].name}-${tarotGlowKeys[activeTarots[0]?.id] ?? 0}`}
                  src={activeTarots[0].src}
                  alt={activeTarots[0].name}
                  className={`tarot-card-image ${tarotGlowKeys[activeTarots[0]?.id] !== undefined ? "tarot-glow" : ""}`}
                  onClick={(e) => {
                    setSelectedTarot(activeTarots[0]);
                    const rect = e.target.getBoundingClientRect();
                    setTooltipPosition({
                      top: rect.top + window.scrollY,
                      left: rect.right + 10,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />
              ) : (
                <div className="tarot-card-placeholder" />
              )}
            </div>

            {activeTarots.length > 1 && (
              <button
                key={`see-all-${seeAllGlowKey}`}
                className={`see-all-tarots-button ${
                  activeTarots.slice(1).some(t => tarotGlowKeys[t.id] !== undefined) ? "see-all-glow" : ""
                }`}
                onClick={() => setSeeAllTarotsOpen(!seeAllTarotsOpen)}
              >
                See All
              </button>
            )}

          </div>

          {/* Right side: remaining tarots */}
          {seeAllTarotsOpen && (
            <div className="tarot-panel-row">
              {activeTarots.slice(1).map((tarot) => (
                <img
                  key={`${tarot.name}-${tarotGlowKeys[tarot.id] ?? 0}`}
                  src={tarot.src}
                  alt={tarot.name}
                  className={`tarot-card-image-smaller ${tarotGlowKeys[tarot.id] !== undefined ? "tarot-glow" : ""}`}
                  onClick={(e) => {
                    setSelectedTarot(tarot);
                    const rect = e.target.getBoundingClientRect();
                    setTooltipPosition({
                      top: rect.top + window.scrollY,
                      left: rect.right + 10,
                    });
                  }}
                />
              ))}

            </div>
          )}

          {/* Floating tooltip box for TAROT info */}
          {selectedTarot && (
            <div
              className="tarot-info-box"
              style={{
                top: tooltipPosition.top,
                left: tooltipPosition.left,
              }}
            >
              <strong>{selectedTarot.name}:</strong>{" "}
              {selectedTarot.effect || "No effect."}
            </div>
          )}

          {onlyOneTarotPopup && (
            <div className="tarot-popup-overlay" onClick={() => setOnlyOneTarotPopup(false)}>
              <div className="tarot-popup-modal" onClick={e => e.stopPropagation()}>
                <h3>There can only be one</h3>
                <p>The Tarot card <strong>{onlyOneTarotName}</strong> is already in play.</p>
                <button onClick={() => setOnlyOneTarotPopup(false)}>OK</button>
              </div>
            </div>
          )}

          {showBlackboardPopup && (
            <div className="popup-overlay">
              <div className="popup">
                <p style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
                  Blackboard can't have Tarots.
                </p>
                <button
                  className="ok-button"
                  onClick={() => setShowBlackboardPopup(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          )}

          {showScholarPopup && (
            <div className="popup-overlay">
              <div className="popup">
                <p style={{ fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1rem" }}>
                  Scholars are immune to Spectral cards.
                </p>
                <button
                  className="ok-button"
                  onClick={() => setShowScholarPopup(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          )}



        </div>
      </div>

      {/* === Joker Panel === */}
      <div className="joker-panel">
        <div className="joker-panel-column">
          <h3 className="joker-panel-title">Joker</h3>

          <div className="joker-slot">
            {myPlayer?.joker ? (
              <div className="joker-image-wrapper">
                <img
                  key={`${myPlayer.joker.name}-${jokerGlowKeys[myPlayer.joker.id] ?? 0}`}
                  src={myPlayer.joker.src}
                  alt={myPlayer.joker.name}
                  className={`joker-card-image ${jokerGlowKeys[myPlayer.joker.id] !== undefined ? "joker-glow" : ""}`}
                  onClick={(e) => {
                    setSelectedJoker(myPlayer.joker);
                    const rect = e.target.getBoundingClientRect();
                    setTooltipPosition({
                      top: rect.top + window.scrollY,
                      left: rect.right + 10,
                    });
                  }}
                  style={{ cursor: "pointer" }}
                />

                {/* Floating Calculate button for Fibonacci Joker */}
                {myPlayer.joker.id === 116 && (
                  <button
                    className="fibonacci-floating-button"
                    onClick={() => setIsFibonacciModalOpen(true)}
                  >
                    Use
                  </button>
                )}

                {/* Floating Use button for Smeared Joker */}
                {myPlayer.joker.id === 130  && (
                  <button
                    className="smeared-floating-button"
                    onClick={() => setIsSmearedModalOpen(true)}
                  >
                    Roll
                  </button>
                  )}

              </div>
            ) : (
              <div className="joker-card-placeholder" />
            )}

          </div>
        </div>

        {/* Floating tooltip box for JOKER info */}
        {selectedJoker && (
          <div
            className="joker-info-box"
            style={{
              top: tooltipPosition.top,
              left: tooltipPosition.left,
            }}
          >
            <strong>{selectedJoker.name}:</strong>{" "}
            {selectedJoker.effect || "No effect."}
          </div>
        )}
      </div>


    </div>
  );
};

export default Game;
