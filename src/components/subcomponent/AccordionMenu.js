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
      content: `igyál lol`
    },
    {
      title: 'KÁRTYÁK',
      content: `xd`,
    }
  ];

  return (
      <div>
        <Form onClick={toggleMenu}>
          <Button className="mb-3 help-game-form-button pixel-font" type="button">GUIDE</Button>
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