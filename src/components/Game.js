import React, { useEffect, useState } from "react";
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



const TurnOrderPanel = ({ players = [], currentPlayerName }) => (
  <div className="turn-order-panel">
    <h3 className="turn-order-title">Ki jön?</h3>
    <ul className="turn-order-list">
      {players.map((player, index) => (
        <li
          key={index}
          className={`turn-order-item ${player.name === currentPlayerName ? "current-turn" : ""}`}
        >
          {player.name}
        </li>
      ))}
    </ul>
  </div>
);

const Game = () => {
  const {
    players,
    deck,
    currentPlayerName,
    brothersGraph,
    drinkEquation,
    setDeck,
    setPlayers,
    setCurrentPlayerName,
    setBrothersGraph,
    setDrinkEquation,
    isChoosingBrother,
    setIsChoosingBrother,
    isChoosingMediumCard,
    setIsChoosingMediumCard,
    isTranceActive,
    setIsTranceActive,
    cardDrawn, setCardDrawn,
    isTurnEnded, setIsTurnEnded,
    readyToEndTurn, setReadyToEndTurn,
    hasActiveDejaVu, setHasActiveDejaVu,
  } = useGameContext();


  const { roomID } = useParams();
  const [mySocketID, setMySocketID] = useState(null);

  // Cards
  const [allCardMetadata, setAllCardMetadata] = useState([]);

  // Coinflip
  const [coinflipOpen, setCoinflipOpen] = useState(false);
  const [flipResult, setFlipResult] = useState(null);

  // D20 Roller
  const [d20Open, setD20Open] = useState(false);
  const [rollResult, setRollResult] = useState(null);
  const d20Effect = rollResult ? D20.find(entry => entry.id === rollResult)?.effect : null;

  // Brothers
  const [brothersOpen, setBrothersOpen] = useState(false);

  // Drink Equation
  const [drinkEquationOpen, setDrinkEquationOpen] = useState(false);

  // 9
  const [chosenBrother, setChosenBrother] = useState("");
  const [brotherModalOpen, setBrotherModalOpen] = useState(false);
  const [forceOpenBrothers, setForceOpenBrothers] = useState(false);


  // king counter
  const [kingsRemaining, setKingsRemaining] = useState(4);

  // rules
  const [rulesModalOpen, setRulesModalOpen] = useState(false);
  const [rulesText, setRulesText] = useState("");

  // MEDIUM
  const [selectedCardID, setSelectedCardID] = useState(1);
  const [mediumModalOpen, setMediumModalOpen] = useState(false);

  // TRANCE
  


  const myPlayer = players.find((player) => player.socketID === mySocketID);
  const isHost = myPlayer?.isHost;
  const myCards = myPlayer?.cardsDrawn || [];




  

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
    const playerList = Object.values(data.players);
    setPlayers(playerList || []);
    setDeck(data.deck || []);
    setCurrentPlayerName(data.currentPlayerName || null);
    setKingsRemaining(data.kingsRemaining ?? 4);

    if (data.brothersGraph) {
      setBrothersGraph(data.brothersGraph);
    }

    const me = playerList.find(p => p.socketID === socket.id);

    // ✅ Always set the drawn card from server state
    setCardDrawn(data.lastDrawnCard || null);

    // ✅ Always reset these turn-related flags
    setIsTurnEnded(false);
    setReadyToEndTurn(false);

    if (me?.effectState) {
      setIsChoosingBrother(me.effectState.isChoosingBrother || false);
      setIsChoosingMediumCard(me.effectState.isChoosingMediumCard || false);
      setIsTranceActive(me.effectState.isTranceActive || false);
      setHasActiveDejaVu(me.effectState.hasActiveDejaVu || false);
    }

    console.log("[RECONNECT] cardDrawn:", data.lastDrawnCard);
    console.log("[RECONNECT] isChoosingBrother:", isChoosingBrother);
    console.log("[RECONNECT] isChoosingMediumCard:", isChoosingMediumCard);
    console.log("[RECONNECT] isTranceActive:", isTranceActive);
    console.log("[RECONNECT] currentPlayerName:", data.currentPlayerName);
    console.log("[RECONNECT] myPlayerName:", me?.name);
  });




    socket.on("cardDrawn", ({ drawnCard, newDeck, updatedPlayers, kingsRemaining }) => {

      setCardDrawn(drawnCard);
      setDeck(newDeck || []);
      setPlayers(updatedPlayers || []);
      setIsTurnEnded(false);
      setKingsRemaining(kingsRemaining);



      const myPlayer = updatedPlayers.find(p => p.socketID === socket.id);

      if (myPlayer && drawnCard?.id && cardEffects[drawnCard.id]) {
        cardEffects[drawnCard.id]({
          player: myPlayer,
          players: updatedPlayers,
          roomID,
          setIsChoosingBrother,
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
      socket.off("updateRulesText");
      socket.off("triggerTrance");
      socket.off("triggerMediumChooseCard");
      socket.off("triggerChooseBrother");
      socket.off("triggerDejaVu");
      socket.off("gameOver");
    };
  }, [roomID, setDeck, setPlayers, setCurrentPlayerName, setBrothersGraph]);

  if (!mySocketID) return <div>Loading game...</div>;

  

  const drawACard = () => {
    if (cardDrawn || myPlayer?.name !== currentPlayerName)
      return;
    socket.emit("drawCard", { roomID });
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
    socket.emit("endTurn", { roomID });
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

  return (
    <div className="game-container">
      <h1 className="game-title">KIRALY 2.0</h1>

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
              {cardDrawn?.Source && (
                <p className="source-text">
                  Source: {cardDrawn.Source}
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
          {cardDrawn === null && !readyToEndTurn ? (
            <button className="floating-button" onClick={drawACard}>
              Draw Card
            </button>
          ) : isChoosingBrother ? (
            <button className="floating-button" onClick={() => setBrotherModalOpen(true)}>
              Choose Brother
            </button>
          ) : isChoosingMediumCard ? (
            <button className="floating-button" onClick={() => setMediumModalOpen(true)}>
              Choose Card
            </button>
          ) : isTranceActive ? (
            <button className="floating-button" onClick={handleTranceShuffle}>
              Shuffle
            </button>
          ) : (
            <button className="floating-button" onClick={endTurn}>
              End Turn
            </button>
          )}
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
        className="drink-equation-button"
        onClick={() => setDrinkEquationOpen(true)}
        title="Drink Equation"
      >
        <img src="/Icons/drink2.png" alt="Drink Equation" className="drink-equation-icon" />
      </button>

      <button className="rules-button" onClick={() => setRulesModalOpen(true)} title="Rules">
        <img src="/Icons/rules.png" alt="Rules" className="rules-icon" />
      </button>


      {/* Coinflip Button */}
      <button className="coinflip-button" onClick={openCoinflip} title="Coinflip">
        <img src="/Icons/cflip.png" alt="Coinflip" className="coinflip-icon" />
      </button>

      {/* D20 Button (below Coinflip) */}
      <button className="d20-button" onClick={openD20} title="Roll D20">
        <img src="/Icons/d20.png" alt="Roll D20" className="d20-icon" />
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
                  src={flipResult === 0 ? "/Coinflip/heads.gif" : "/Coinflip/tails.gif"}
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
                  <img src="/Coinflip/d20.gif" alt="Rolling D20" className="d20-gif" />
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

      {brotherModalOpen && (
        <div className="brother-modal-overlay">
          <div className="brother-modal">
            <h3>Pick a brother</h3>
            <select
              value={chosenBrother}
              onChange={(e) => setChosenBrother(e.target.value)}
              className="brother-dropdown"
            >
              <option value="">- Pick -</option>
              {players
                .filter((p) => p.name !== myPlayer.name)
                .map((p) => (
                  <option key={p.socketID} value={p.name}>
                    {p.name}
                  </option>
                ))}
            </select>
            <button
              onClick={() => {
                if (!chosenBrother) return;

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
            <select
              value={selectedCardID}
              onChange={(e) => setSelectedCardID(Number(e.target.value))}
              className="brother-dropdown"
            >
              {allCardMetadata
              .filter(card => card.id >= 1 && card.id <= 13)
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
                setSelectedCardID(1);
                setCardDrawn(null);  // <-- ✅ reset the drawn card
                setReadyToEndTurn(true);  // <-- ✅ show End Turn

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


    </div>
  );
};

export default Game;
