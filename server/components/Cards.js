const Cards = [
  // Spades (♠)
  { id: 1, cardType: "French", name: "♠Ace", effect: "Vízesés, balra", color: "black", src: "/CardImages/spades/1AceOfSpades.png", source: "" },
  { id: 2, cardType: "French", name: "♠2", effect: "Coinflip duel", color: "black", src: "/CardImages/spades/2OfSpades.png", source: "" },
  { id: 3, cardType: "French", name: "♠3", effect: "Igyál 3 kortyot", color: "black", src: "/CardImages/spades/3OfSpades.png", source: "" },
  { id: 4, cardType: "French", name: "♠4", effect: "Igyál 4 kortyot", color: "black", src: "/CardImages/spades/4OfSpades.png", source: "" },
  { id: 5, cardType: "French", name: "♠5", effect: "Igyál 5 kortyot", color: "black", src: "/CardImages/spades/5OfSpades.png", source: "" },
  { id: 6, cardType: "French", name: "♠6", effect: "Ha fiú húzza, kioszt 6-ot, ha lány húzza, iszik 6-ot", color: "black", src: "/CardImages/spades/6OfSpades.png", source: "" },
  { id: 7, cardType: "French", name: "♠7", effect: "Drink or dare", color: "black", src: "/CardImages/spades/7OfSpades.png", source: "" },
  { id: 8, cardType: "French", name: "♠8", effect: "D20", color: "black", src: "/CardImages/spades/8OfSpades.png", source: "" },
  { id: 9, cardType: "French", name: "♠9", effect: "Blood Brother", color: "black", src: "/CardImages/spades/9OfSpades.png", source: "" },
  { id: 10, cardType: "French", name: "♠10", effect: "Új szabály", color: "black", src: "/CardImages/spades/10OfSpades.png", source: "" },
  { id: 11, cardType: "French", name: "♠Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "black", src: "/CardImages/spades/11JackOfSpades.png", source: "" },
  { id: 12, cardType: "French", name: "♠Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "black", src: "/CardImages/spades/12QueenOfSpades.png", source: "" },
  { id: 13, cardType: "French", name: "♠King", effect: "Király", color: "black", src: "/CardImages/spades/13KingOfSpades.png", source: "" },

  // Hearts (♥)
  { id: 14, cardType: "French", name: "♥Ace", effect: "Vízesés, jobbra", color: "red", src: "/CardImages/hearts/1AceOfHearts.png", source: "" },
  { id: 15, cardType: "French", name: "♥2", effect: "Coinflip duel", color: "red", src: "/CardImages/hearts/2OfHearts.png", source: "" },
  { id: 16, cardType: "French", name: "♥3", effect: "Ossz ki 3 kortyot", color: "red", src: "/CardImages/hearts/3OfHearts.png", source: "" },
  { id: 17, cardType: "French", name: "♥4", effect: "Ossz ki 4 kortyot", color: "red", src: "/CardImages/hearts/4OfHearts.png", source: "" },
  { id: 18, cardType: "French", name: "♥5", effect: "Ossz ki 5 kortyot", color: "red", src: "/CardImages/hearts/5OfHearts.png", source: "" },
  { id: 19, cardType: "French", name: "♥6", effect: "Ha lány húzza, kioszt 6-ot, ha fiú húzza, iszik 6-ot", color: "red", src: "/CardImages/hearts/6OfHearts.png", source: "" },
  { id: 20, cardType: "French", name: "♥7", effect: "Drink or dare", color: "red", src: "/CardImages/hearts/7OfHearts.png", source: "" },
  { id: 21, cardType: "French", name: "♥8", effect: "D20", color: "red", src: "/CardImages/hearts/8OfHearts.png", source: "" },
  { id: 22, cardType: "French", name: "♥9", effect: "Blood Brother", color: "red", src: "/CardImages/hearts/9OfHearts.png", source: "" },
  { id: 23, cardType: "French", name: "♥10", effect: "Új szabály", color: "red", src: "/CardImages/hearts/10OfHearts.png", source: "" },
  { id: 24, cardType: "French", name: "♥Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "red", src: "/CardImages/hearts/11JackOfHearts.png", source: "" },
  { id: 25, cardType: "French", name: "♥Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "red", src: "/CardImages/hearts/12QueenOfHearts.png", source: "" },
  { id: 26, cardType: "French", name: "♥King", effect: "Király", color: "red", src: "/CardImages/hearts/13KingOfHearts.png", source: "" },

  // Diamonds (♦)
  { id: 27, cardType: "French", name: "♦Ace", effect: "Vízesés, jobbra", color: "red", src: "/CardImages/diamonds/1AceOfDiamonds.png", source: ""  },
  { id: 28, cardType: "French", name: "♦2", effect: "Coinflip duel", color: "red", src: "/CardImages/diamonds/2OfDiamonds.png", source: ""  },
  { id: 29, cardType: "French", name: "♦3", effect: "Ossz ki 3 kortyot", color: "red", src: "/CardImages/diamonds/3OfDiamonds.png", source: ""  },
  { id: 30, cardType: "French", name: "♦4", effect: "Ossz ki 4 kortyot", color: "red", src: "/CardImages/diamonds/4OfDiamonds.png", source: ""  },
  { id: 31, cardType: "French", name: "♦5", effect: "Ossz ki 5 kortyot", color: "red", src: "/CardImages/diamonds/5OfDiamonds.png", source: ""  },
  { id: 32, cardType: "French", name: "♦6", effect: "Ha lány húzza, kioszt 6-ot, ha fiú húzza, iszik 6-ot", color: "red", src: "/CardImages/diamonds/6OfDiamonds.png", source: ""  },
  { id: 33, cardType: "French", name: "♦7", effect: "Drink or dare", color: "red", src: "/CardImages/diamonds/7OfDiamonds.png", source: ""  },
  { id: 34, cardType: "French", name: "♦8", effect: "D20", color: "red", src: "/CardImages/diamonds/8OfDiamonds.png", source: ""  },
  { id: 35, cardType: "French", name: "♦9", effect: "Blood Brother", color: "red", src: "/CardImages/diamonds/9OfDiamonds.png", source: ""  },
  { id: 36, cardType: "French", name: "♦10", effect: "Új szabály", color: "red", src: "/CardImages/diamonds/10OfDiamonds.png", source: ""  },
  { id: 37, cardType: "French", name: "♦Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "red", src: "/CardImages/diamonds/11JackOfDiamonds.png", source: ""  },
  { id: 38, cardType: "French", name: "♦Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "red", src: "/CardImages/diamonds/12QueenOfDiamonds.png", source: ""  },
  { id: 39, cardType: "French", name: "♦King", effect: "Király", color: "red", src: "/CardImages/diamonds/13KingOfDiamonds.png", source: ""  },

  // Clubs (♣)
  { id: 40, cardType: "French", name: "♣Ace", effect: "Vízesés, balra", color: "black", src: "/CardImages/clubs/1AceOfClubs.png", source: "" },
  { id: 41, cardType: "French", name: "♣2", effect: "Coinflip duel", color: "black", src: "/CardImages/clubs/2OfClubs.png", source: "" },
  { id: 42, cardType: "French", name: "♣3", effect: "Igyál 3 kortyot", color: "black", src: "/CardImages/clubs/3OfClubs.png", source: "" },
  { id: 43, cardType: "French", name: "♣4", effect: "Igyál 4 kortyot", color: "black", src: "/CardImages/clubs/4OfClubs.png", source: "" },
  { id: 44, cardType: "French", name: "♣5", effect: "Igyál 5 kortyot", color: "black", src: "/CardImages/clubs/5OfClubs.png", source: "" },
  { id: 45, cardType: "French", name: "♣6", effect: "Ha fiú húzza, kioszt 6-ot, ha lány húzza, iszik 6-ot", color: "black", src: "/CardImages/clubs/6OfClubs.png", source: "" },
  { id: 46, cardType: "French", name: "♣7", effect: "Drink or dare", color: "black", src: "/CardImages/clubs/7OfClubs.png", source: "" },
  { id: 47, cardType: "French", name: "♣8", effect: "D20", color: "black", src: "/CardImages/clubs/8OfClubs.png", source: "" },
  { id: 48, cardType: "French", name: "♣9", effect: "Blood Brother", color: "black", src: "/CardImages/clubs/9OfClubs.png", source: "" },
  { id: 49, cardType: "French", name: "♣10", effect: "Új szabály", color: "black", src: "/CardImages/clubs/10OfClubs.png", source: "" },
  { id: 50, cardType: "French", name: "♣Jack", effect: "Annyi korty minden fiúnak, ahány fiú van", color: "black", src: "/CardImages/clubs/11JackOfClubs.png", source: "" },
  { id: 51, cardType: "French", name: "♣Queen", effect: "Annyi korty minden lánynak, ahány lány van", color: "black", src: "/CardImages/clubs/12QueenOfClubs.png", source: "" },
  { id: 52, cardType: "French", name: "♣King", effect: "Király", color: "black", src: "/CardImages/clubs/13KingOfClubs.png", source: "" },

  // SPECTRAL
  { id: 53, cardType: "SPECTRAL", name: "Ankh", effect: "A szorzód 1-re, a plusz kortyaid pedig 0-ra állítódnak (ha negatívak a plusz kortyaid, akkor változatlanul maradnak)", color: "", src: "/CardImages/SPECTRAL/ankh.png", source: "" },
  { id: 54, cardType: "SPECTRAL", name: "Aura", effect: "Mindenki akinek eddig a tesója voltál, mostantól a tesód", color: "", src: "/CardImages/SPECTRAL/aura.png", source: "" },
  { id: 55, cardType: "SPECTRAL", name: "Black hole", effect: "Mindenki befejezi az italát, viszont aki felhúzta, az előtte újratölti az övét", color: "", src: "/CardImages/SPECTRAL/black hole.png", source: "" },
  { id: 56, cardType: "SPECTRAL", name: "Cryptid", effect: "Általad válaszott játékos dob egyet a D20-al, ha nem 20-ast dobott akkor iszik egy kortyot, addig ismétli amég nem sikerül 20-ast dobnia", color: "", src: "/CardImages/SPECTRAL/cryptid.png", source: "" },
  { id: 57, cardType: "SPECTRAL", name: "Deja vu", effect: "Az előző körben játszott lapodat újra kijátszod (Ha nincsenek felhúzott lapjaid, akkor kapsz egy random SPECTRAL kártyát)", color: "", src: "/CardImages/SPECTRAL/deja vu.png", source: "" },
  { id: 58, cardType: "SPECTRAL", name: "Ectoplasm", effect: "Igyál annyi kortyot, ahány éves vagy /2", color: "", src: "/CardImages/SPECTRAL/ectoplasm.png", source: "" },
  { id: 59, cardType: "SPECTRAL", name: "Familiar", effect: "Keverj egy italt, majd válassz valakit akivel elfelezed", color: "", src: "/CardImages/SPECTRAL/familiar.png", source: "" },
  { id: 60, cardType: "SPECTRAL", name: "Grim", effect: "Dobj egyet egy D6-al, majd idd meg a dobott szám négyzetét", color: "", src: "/CardImages/SPECTRAL/grim.png", source: "" },
  { id: 61, cardType: "SPECTRAL", name: "Hex", effect: "Sózd meg az italod (ízlés szerint xd)", color: "", src: "/CardImages/SPECTRAL/hex.png", source: "" },
  { id: 62, cardType: "SPECTRAL", name: "Immolate", effect: "Rakj valami csípőset az italodba xd", color: "", src: "/CardImages/SPECTRAL/immolate.png", source: "" },
  { id: 63, cardType: "SPECTRAL", name: "Incantation", effect: "Húzz 5 lapot", color: "", src: "/CardImages/SPECTRAL/incantation.png", source: "" },
  { id: 64, cardType: "SPECTRAL", name: "Medium", effect: "Választhatsz egy francia kártyát amiből 3 db belekeveredik a pakliba", color: "", src: "/CardImages/SPECTRAL/medium.png", source: "" },
  { id: 65, cardType: "SPECTRAL", name: "Ouija", effect: "Választhatsz egy lapot az általad kijátszott lapok közül, amit megkapsz megint (Ha nincsenek felhúzott lapjaid, akkor kapsz egy random SPECTRAL kártyát)", color: "", src: "/CardImages/SPECTRAL/ouija.png", source: "" },
  { id: 66, cardType: "SPECTRAL", name: "Sigil", effect: "Húzhatsz egy véletlenszerű FRENCH kártyát, ami 2x játszódik ki", color: "", src: "/CardImages/SPECTRAL/sigil.png", source: "" },
  { id: 67, cardType: "SPECTRAL", name: "Soul", effect: "Igyál egy pohár vizet, szükséged lesz rá", color: "", src: "/CardImages/SPECTRAL/soul.png", source: "" },
  { id: 68, cardType: "SPECTRAL", name: "Talisman", effect: "Húzz 2 véletlenszerű SPECTRAL lapot", color: "", src: "/CardImages/SPECTRAL/talisman.png", source: "" },
  { id: 69, cardType: "SPECTRAL", name: "Trance", effect: "Minden kártya amit ezelőtt felhúztál visszakeveredik a pakliba (Ha nincsenek felhúzott lapjaid, akkor kapsz egy random SPECTRAL kártyát)", color: "", src: "/CardImages/SPECTRAL/trance.png", source: "" },
  { id: 70, cardType: "SPECTRAL", name: "Wraith", effect: "Tölts ki 1 shotnyi vizet és 1 shotnyi átlátszó alkoholt, majd válassz valakit aki eldöntheti hogy melyiket issza meg, te pedig idd meg a másikat", color: "", src: "/CardImages/SPECTRAL/wraith.png", source: "" },

  // PLANET
  { id: 71, cardType: "PLANET", name: "Eris", effect: "Minden új szabály bevezerésekor mindenki iszik 5 kortyot", color: "", src: "/CardImages/PLANET/eris.png", source: "" },
  { id: 72, cardType: "PLANET", name: "Ceres", effect: "Minden lap felhúzásánál iszik 1 kortyot aki felhúzta", color: "", src: "/CardImages/PLANET/ceres.png", source: "" },
  { id: 73, cardType: "PLANET", name: "Planet X", effect: "Amikor ezt a lapot felhúzzák, az összes eddig felhúzott lap belekeveredik a pakliba", color: "", src: "/CardImages/PLANET/planet x.png", source: "" },
  { id: 74, cardType: "PLANET", name: "Mercury", effect: "Mostantól mindenki annyival több kortyot iszik, ahányadik a körben a lap felhúzójától számítva", color: "", src: "/CardImages/PLANET/mercury.png", source: "" },
  { id: 75, cardType: "PLANET", name: "Venus", effect: "Minden lány iszik 1 kortyot minden kör végén. A QUEEN kártyák +1-el emelik az összes lány + kortyait", color: "", src: "/CardImages/PLANET/venus.png", source: "" },
  { id: 76, cardType: "PLANET", name: "Earth", effect: "A körben utánad következő játékos az általad játszott kártyát szintén kijátssza", color: "", src: "/CardImages/PLANET/earth.png", source: "" },
  { id: 77, cardType: "PLANET", name: "Mars", effect: "Ha valaki piros FRENCH lapot húz, iszik 1 kortyot", color: "", src: "/CardImages/PLANET/mars.png", source: "" },
  { id: 78, cardType: "PLANET", name: "Jupiter", effect: "Minden fiú iszik 1 kortyot minden kör végén. A JACK kártyák +1-el emelik az összes fiú + kortyait", color: "", src: "/CardImages/PLANET/jupiter.png", source: "" },
  { id: 79, cardType: "PLANET", name: "Saturn", effect: "Mindenkinek a jobboldali szomszédja keveri az italait", color: "", src: "/CardImages/PLANET/saturn.png", source: "" },
  { id: 80, cardType: "PLANET", name: "Uranus", effect: "Ha valaki kockával dob, annyit iszik, amilyen számot dobott", color: "", src: "/CardImages/PLANET/uranus.png", source: "" },
  { id: 81, cardType: "PLANET", name: "Neptune", effect: "Minden vízesés 2-szer megy körbe", color: "", src: "/CardImages/PLANET/neptune.png", source: "" },
  { id: 82, cardType: "PLANET", name: "Pluto", effect: "Ha valaki önt valamit a királyba, előtte meg kell innia fele annyit az adott italból", color: "", src: "/CardImages/PLANET/pluto.png", source: "" },

  // TAROT
  { id: 83, cardType: "TAROT", name: "Fool", effect: "Minden kör végén feldob egy érmét, ha fejet dob iszik 2-t", color: "", src: "/CardImages/TAROT/fool.png", source: "" },
  { id: 84, cardType: "TAROT", name: "Magician", effect: "2-t húz körönként", color: "", src: "/CardImages/TAROT/magician.png", source: "" },
  { id: 85, cardType: "TAROT", name: "High Priestess", effect: "Mostantól nem rakhatnak rá SPECTRAL lapokat, és általa kijátszott SPECTRAL lapok 2x játszódnak ki", color: "", src: "/CardImages/TAROT/high priestess.png", source: "" },
  { id: 86, cardType: "TAROT", name: "Empress", effect: "Annyival kevesebbet iszik, ahány lány van. Kitalálhat egy szabályt, ami csak a lányokra hat", color: "", src: "/CardImages/TAROT/empress.png", source: "" },
  { id: 87, cardType: "TAROT", name: "Emperor", effect: "Annyival kevesebbet iszik, ahány fiú van. Kitalálhat egy szabályt, ami csak a fiúkra hat", color: "", src: "/CardImages/TAROT/emperor.png", source: "" },
  { id: 88, cardType: "TAROT", name: "Hierophant", effect: "Mostantól minden 10-es szabályt te hozol meg", color: "", src: "/CardImages/TAROT/hierophant.png", source: "" },
  { id: 89, cardType: "TAROT", name: "Lovers", effect: "Választhatsz egy LOVER-t, aki mostantól a kortyaid felét megissza", color: "", src: "/CardImages/TAROT/lovers.png", source: "" },
  { id: 90, cardType: "TAROT", name: "Chariot", effect: "Ha innia kellene, dobhat egy D6-tal. Ha 6-ost dob, visszaadja annak, akitől kapta", color: "", src: "/CardImages/TAROT/chariot.png", source: "" },
  { id: 91, cardType: "TAROT", name: "Justice", effect: "Minimum 2-t iszik, de maximum 10-et (rendes játékmenet)", color: "", src: "/CardImages/TAROT/justice.png", source: "" },
  { id: 92, cardType: "TAROT", name: "Hermit", effect: "Nem lehet testvéred (LOVER-ed se)", color: "", src: "/CardImages/TAROT/hermit.png", source: "" },
  { id: 93, cardType: "TAROT", name: "Wheel Of Fortune", effect: "Minden kör végén rollol egy d20-al (kijátszódik az effektje)", color: "", src: "/CardImages/TAROT/wheel of fortune.png", source: "" },
  { id: 94, cardType: "TAROT", name: "Strength", effect: "-2-t iszik, de a pohara kétszer akkora (min. 500ml, ha sör akkor 1L)", color: "", src: "/CardImages/TAROT/strength.png", source: "" },
  { id: 95, cardType: "TAROT", name: "Hanged Man", effect: "Kör végén iszik 3-at", color: "", src: "/CardImages/TAROT/hanged man.png", source: "" },
  { id: 96, cardType: "TAROT", name: "Death", effect: "A játék végéig 2x annyit iszik", color: "", src: "/CardImages/TAROT/death.png", source: "" },
  { id: 97, cardType: "TAROT", name: "Temperance", effect: "Minden vízesés tőled indul", color: "", src: "/CardImages/TAROT/temperance.png", source: "" },
  { id: 98, cardType: "TAROT", name: "Devil", effect: "A játék végéig egy általad választott player italait te kevered", color: "", src: "/CardImages/TAROT/devil.png", source: "" },
  { id: 99, cardType: "TAROT", name: "Tower", effect: "Eldobhat Francia (3 korty), TAROT (5 korty) és PLANET (10 korty) kártyákat", color: "", src: "/CardImages/TAROT/tower.png", source: "" },
  { id: 100, cardType: "TAROT", name: "Star", effect: "Ahány testvéred van, annyival kevesebb kortyot kell innod", color: "", src: "/CardImages/TAROT/star.png", source: "" },
  { id: 101, cardType: "TAROT", name: "Moon", effect: "Minden köröd végén kapsz egy SPECTRAL lapot", color: "", src: "/CardImages/TAROT/moon.png", source: "" },
  { id: 102, cardType: "TAROT", name: "Sun", effect: "Választhatsz két PLANET lapot, amik mostantól aktívak lesznek", color: "", src: "/CardImages/TAROT/sun.png", source: "" },
  { id: 103, cardType: "TAROT", name: "Judgement", effect: "Ha ivott a körben, a kör végén kioszthat 5 kortyot", color: "", src: "/CardImages/TAROT/judgement.png", source: "" },
  { id: 104, cardType: "TAROT", name: "World", effect: "Minden általad játszott kártya 2x fire-el", color: "", src: "/CardImages/TAROT/world.png", source: "" },

  // JOKER
  { id: 105, cardType: "JOKER", name: "Joker", effect: "A kör végén dob egy D20-al, ha 20-ast dob, kioszt egy egész italt", color: "", src: "/CardImages/JOKER/joker.png", source: "" },
  { id: 106, cardType: "JOKER", name: "Greedy Joker", effect: "Ha a kör végén a legtöbbet ivott, kioszt 10 kortyot, ha a legkevesebbet, iszik 5-öt", color: "", src: "/CardImages/JOKER/greedy joker.png", source: "" },
  { id: 107, cardType: "JOKER", name: "Wrathful Joker", effect: "Kiválaszt egy játékost, csak ellene használhat lapokat. Az ellen a játékos ellen minden lapja duplát ér, ha attól a játékostól kap lapot, az fele annyit ér", color: "", src: "/CardImages/JOKER/wrathful joker.png", source: "" },
  { id: 108, cardType: "JOKER", name: "Gluttonous Joker", effect: "A játék elején -8 kortyot iszik, viszont ez körönként 1-el növekszik", color: "", src: "/CardImages/JOKER/gluttonous joker.png", source: "" },
  { id: 109, cardType: "JOKER", name: "Jolly Joker", effect: "Minden alkalommal amikor valaki kockával dob, kioszt 1 kortyot", color: "", src: "/CardImages/JOKER/jolly joker.png", source: "" },
  { id: 110, cardType: "JOKER", name: "Mad Joker", effect: "Ha a körben 5-nél többet iszik, iszik még 5-öt és kioszt 10-et, akármilyen felosztásban (akár oszthat 5 embernek 2 kortyot)", color: "", src: "/CardImages/JOKER/mad joker.png", source: "" },
  { id: 111, cardType: "JOKER", name: "Crazy Joker", effect: "A kör végén dob egy D6-al, ha 6-ot dob, valaki italába rakhat akármit, ha mást, iszik 3-at", color: "", src: "/CardImages/JOKER/crazy joker.png", source: "" },
  { id: 112, cardType: "JOKER", name: "Devious Joker", effect: "A kör végén dob egy D20-al, majd annyi kortyot kioszt valakinek ahányat dobott", color: "", src: "/CardImages/JOKER/devious joker.png", source: "" },
  { id: 113, cardType: "JOKER", name: "Half Joker", effect: "Fele annyit iszol a játék alatt, viszont csak fele annyit oszthatsz ki", color: "", src: "/CardImages/JOKER/half joker.png", source: "" },
  { id: 114, cardType: "JOKER", name: "Mime", effect: "A játék elején lemásolja valamelyik másik játékos Jokerét", color: "", src: "/CardImages/JOKER/mime.png", source: "" },
  { id: 115, cardType: "JOKER", name: "Misprint", effect: "50% esély, hogy rossz előjellel kap extra kortyokat, és 50% esély, hogy rossz irányba kerülnek fel a tesói", color: "", src: "/CardImages/JOKER/misprint.png", source: "" },
  { id: 116, cardType: "JOKER", name: "Fibonacci", effect: "Ha van oda-vissza testvére, akkor testvérével együtt Fibonacci-számsor szerint isznak", color: "", src: "/CardImages/JOKER/fibonacci.png", source: "" },
  { id: 117, cardType: "JOKER", name: "Abstract Joker", effect: "rework", color: "", src: "/CardImages/JOKER/abstract joker.png", source: "" },
  { id: 118, cardType: "JOKER", name: "Scholar", effect: "A SPECTRAL kártyák nem hatnak rá", color: "", src: "/CardImages/JOKER/scholar.png", source: "" },
  { id: 119, cardType: "JOKER", name: "Blackboard", effect: "A TAROT kártyák nem hatnak rá", color: "", src: "/CardImages/JOKER/blackboard.png", source: "" },
  { id: 120, cardType: "JOKER", name: "Constellation", effect: "A PLANET kártyák nem hatnak rá", color: "", src: "/CardImages/JOKER/constellation.png", source: "" },
  { id: 121, cardType: "JOKER", name: "Faceless Joker", effect: "A kör végén dob egy 4-essel, ha 1-est dob, kap egy új véletlenszerű JOKER-t (minden körben dob, ha kapott új JOKER-t akkor is)", color: "", src: "/CardImages/JOKER/faceless joker.png", source: "" },
  { id: 122, cardType: "JOKER", name: "Square Joker", effect: "Minden alkalommal, amikor pontosan 4 kortyot iszik, kioszt 4 kortyot mindenkinek (magán kívül)", color: "", src: "/CardImages/JOKER/square joker.png", source: "" },
  { id: 123, cardType: "JOKER", name: "Vagabond", effect: "Ha elfogy az itala, iszik 5-öt", color: "", src: "/CardImages/JOKER/vagabond.png", source: "" },
  { id: 124, cardType: "JOKER", name: "The Baron", effect: "A kör végén dob egy 6-os kockával, ha 6-ost dob, egy általa válaszott játékos iszik helyette a kör végéig, ha 1-est iszik 5-öt", color: "", src: "/CardImages/JOKER/the baron.png", source: "" },
  { id: 125, cardType: "JOKER", name: "Hallucination", effect: "Ha TAROT kártyát húz, eldöntheti, hogy megtartja, vagy új kártyát húz", color: "", src: "/CardImages/JOKER/hallucination.png", source: "" },
  { id: 126, cardType: "JOKER", name: "The Drunkard", effect: "A kör végén iszik 3 kortyot", color: "", src: "/CardImages/JOKER/the drunkard.png", source: "" },
  { id: 127, cardType: "JOKER", name: "The Bull", effect: "Minden testvéred +3 kortyot iszik", color: "", src: "/CardImages/JOKER/the bull.png", source: "" },
  { id: 128, cardType: "JOKER", name: "Ancient Joker", effect: "Választhat egy TAROT és egy JOKER kártyát", color: "", src: "/CardImages/JOKER/ancient joker.png", source: "" },
  { id: 129, cardType: "JOKER", name: "The Bard", effect: "A játék DJ-je, -2-t iszik, +1-et oszt ki", color: "", src: "/CardImages/JOKER/the bard.png", source: "" },
  { id: 130, cardType: "JOKER", name: "Smeared Joker", effect: "Minden kör végén dob egy 6-os kockával, amikor/ha a játék alatt a dobásainak összege meghaladja az 50-et, megiszik és kioszt egy-egy általa kevert italt", color: "", src: "/CardImages/JOKER/smeared joker.png", source: "" },
  { id: 131, cardType: "JOKER", name: "Brainstorm", effect: "A kör végén dob egy D20-al, ha 20-ast dob, kitalálhat egy új szabályt", color: "", src: "/CardImages/JOKER/brainstorm.png", source: "" },
  { id: 132, cardType: "JOKER", name: "Burnt Joker", effect: "Minden kör végén feldob egy érmét, ha fej, annyit iszik ahányadik kör van, ha írás, annyit kioszt", color: "", src: "/CardImages/JOKER/burnt joker.png", source: "" },
  { id: 133, cardType: "JOKER", name: "Arthur", effect: "A játék elején dob egy 6-os kockával, ha 6-ost dob, kitalálhat egy új szabályt, ha mást, akkor a játék végéig minden kör végén iszik 5 kortyot", color: "", src: "/CardImages/JOKER/arthur.png", source: "" },
  { id: 134, cardType: "JOKER", name: "To Do List", effect: "Minden italában minimum 3 alapanyagnak kell lennie", color: "", src: "/CardImages/JOKER/to do list.png", source: "" },
  { id: 135, cardType: "JOKER", name: "Scary Face", effect: "A játék elején választania kell egy francia kártyát, amit ha ő húz fel, iszik egy felest", color: "", src: "/CardImages/JOKER/scary face.png", source: "" },
  { id: 136, cardType: "JOKER", name: "Egg", effect: "tbd", color: "", src: "/CardImages/JOKER/egg.png", source: "" },
  { id: 137, cardType: "JOKER", name: "Runner", effect: "Minden körben amikor először iszik, továbbad -1 kortynyit egy általa választott játékosnak, aki miután megitta, szintén továbbad -1 kortynyit, amíg a kortyok száma el nem éri a nullát", color: "", src: "/CardImages/JOKER/runner.png", source: "" },
  { id: 138, cardType: "JOKER", name: "Hiker", effect: "Minden itala 1 alapanyagból kell hogy készüljön, ha felhúz QUEEN, JACK, vagy KING kártyákat, akkor a következő italának 1-el több alapanyagból kell készülnie", color: "", src: "/CardImages/JOKER/hiker.png", source: "" },
  { id: 139, cardType: "JOKER", name: "Burglar", effect: "tbd", color: "", src: "/CardImages/JOKER/burglar.png", source: "" },
  { id: 140, cardType: "JOKER", name: "Credit Card", effect: "tbd", color: "", src: "/CardImages/JOKER/credit card.png", source: "" },
  { id: 141, cardType: "JOKER", name: "Mr. Bones", effect: "+7 kortyot iszik 💀", color: "", src: "/CardImages/JOKER/mr. bones.png", source: "" },
  { id: 142, cardType: "JOKER", name: "8 Ball", effect: "tbd", color: "", src: "/CardImages/JOKER/8 ball.png", source: "" },
  { id: 143, cardType: "JOKER", name: "Ice Cream", effect: "tbd", color: "", src: "/CardImages/JOKER/ice cream.png", source: "" },
  { id: 144, cardType: "JOKER", name: "Sixth Sense", effect: "tbd", color: "", src: "/CardImages/JOKER/sixth sense.png", source: "" },
  { id: 145, cardType: "JOKER", name: "Banana", effect: "tbd", color: "", src: "/CardImages/JOKER/banana.png", source: "" },
  { id: 146, cardType: "JOKER", name: "Hacker", effect: "Minden kör végén dob egy D20-al, ha 20-at dob, spikeolhat valakit. Ha 10-et, vagy kevesebbet, iszik 5-15-öt. Ha így eléri az 50 kortyot, akkor 3 embert spikeolhat", color: "", src: "/CardImages/JOKER/hacker.png", source: "" },
  { id: 147, cardType: "JOKER", name: "Madness", effect: "tbd", color: "", src: "/CardImages/JOKER/madness.png", source: "" },
  { id: 148, cardType: "JOKER", name: "Business Card", effect: "A játék elején választ valakit, akivel mindketten készítenek egy-egy italt, majd egy véletlenszerűen választott játékos értékeli az italokat. A vereség komoly következményekkel jár...", color: "", src: "/CardImages/JOKER/business card.png", source: "" },
  { id: 149, cardType: "JOKER", name: "Merry Andy", effect: "Ha nem ivott az adott körben, akkor iszik 3x annyi kortyot ahány játékos van a játékban", color: "", src: "/CardImages/JOKER/merry andy.png", source: "" },
  { id: 150, cardType: "JOKER", name: "To The Moon", effect: "Mielőtt iszik, feldob egy érmét. Ha fejet dob, a kapott kortyok -100%-át kell innia, ha írást, a +100%-át", color: "", src: "/CardImages/JOKER/to the moon.png", source: "" },


];

module.exports = Cards;
