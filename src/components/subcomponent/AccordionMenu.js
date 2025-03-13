import React, { useState } from 'react';
import { Form, Button, Accordion, Image } from 'react-bootstrap'

import DOMPurify from 'dompurify';
import '../../assets/CreateGameForm.css';


import { AnimatePresence, motion } from 'framer-motion';

const AccordionMenu = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const accordionItems = [
    {
      title: 'SZABÁLYOK',
      content: `<strong>Bisca</strong> is a popular card game that originated in <b>Portugal</b> and is played in many other countries such as Spain, Italy, Cape Verde, Angola, etc. The game is similar to the Italian Briscola or the Spanish Brisca.<br><br>
      Some variations of Bisca can be played in teams between 4 people, but in this case, the website only hosts the two player version.<br><br>
      The origins of <b>Bisca</b> are uncertain, but it is believed to have evolved from the earlier Italian card game, <b>Briscola</b>, during a period of cultural exchange between the two countires.<br><br>
      Bisca is played with a 40 card-deck, and the aim is to achieve as many points from card tricks as possible. How the game works is described in the following sections.`
    },
    {
      title: 'KÁRTYÁK',
      content: `Each player draws <b>three</b> cards from the deck, and <b>one</b> additional card is drawn as the <b>trump card</b> at the centre of the board.<br><br>
      The <b>trump card</b> determines the suit that can win any trick. This means that if you play a card of the same suit as the trump card (and your opponent does not), you win the trick.<br><br>
      If both players play cards of the same suit, the player with the <b>highest</b> value card of that suit wins the trick (note that this happens if both players play the suit of the trump card).<br><br>
      If neither player plays a card of the trump suit, and both players play cards of different suits, the first player who played a card wins the trick.<br><br>
      The points system for the game is shown above.`,
    }
  ];

  return (
      <div>
        <Form onClick={toggleMenu}>
          <Button className="mb-3 help-game-form-button" type="button">GUIDE</Button>
        </Form>
        <AnimatePresence>
          {showMenu && (
              <motion.div
                className='full-screen-box overflow-auto'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 17 }}
              >
                <div className='close' onClick={toggleMenu}></div>
                <div class="h3 mt-4 mb-4" style={{ color: "white" }}>GUIDE</div>
                <Accordion defaultActiveKey="0">
                  {accordionItems.map((item, index) => (
                    <Accordion.Item eventKey={index}>
                      <Accordion.Header>
                        {item.title}      
                      </Accordion.Header>
                      <Accordion.Body>
                        {item.image && <Image className="float-start mr-5" style={{ maxWidth: "400px", marginRight: "18px", border: "2px solid black"}} src={item.image}></Image>}
                        <p class="text-start" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content)}}></p>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </motion.div>)}
        </AnimatePresence>
      </div>
    );
};

export default AccordionMenu;