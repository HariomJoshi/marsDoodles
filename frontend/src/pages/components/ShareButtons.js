import React, { useState } from 'react';
import { FacebookShareButton,FacebookIcon, TwitterShareButton, TwitterIcon, WhatsappShareButton, WhatsappIcon, LinkedinShareButton, LinkedinIcon } from 'react-share';
import { FaFacebookSquare, FaTwitterSquare, FaWhatsappSquare, FaLinkedin } from 'react-icons/fa';

const ShareButtons = ({shareUrl}) => {
  const [title, setTitle] = useState("My canvas drawing on bit2byte !")
  const iconStyle = { fontSize: '30px', marginRight: '10px', color: 'white' };


  function shareOnTwitter(shareUrl, title) {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank');
  }
  
  function shareOnLinkedIn(shareUrl, title) {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
    window.open(linkedInUrl, '_blank');
  }

  function shareOnWhatsApp(shareUrl, title) {
    const whatsAppUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${encodeURIComponent(shareUrl)}`;
    window.open(whatsAppUrl, '_blank');
  }

  // testing pending for facebook
  function shareOnFacebook(shareUrl, title) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(title)}`;
    window.open(facebookUrl, '_blank');
  }
  

  return (
    <>
      <button onClick={() => shareOnFacebook(shareUrl, title)}>
        <FacebookIcon size={40} borderRadius={15}/>
      </button>
      <button onClick={() => shareOnTwitter(shareUrl, title)}>
        <TwitterIcon size={40} borderRadius={15}/>
      </button>
      <button onClick={() => shareOnWhatsApp(shareUrl, title)}>
        <WhatsappIcon size={40} borderRadius={15}/>
      </button>
      <button onClick={() => shareOnLinkedIn(shareUrl, title)}>
        <LinkedinIcon size={40} borderRadius={15}/>
      </button>
    </>
  );
};

export default ShareButtons;
