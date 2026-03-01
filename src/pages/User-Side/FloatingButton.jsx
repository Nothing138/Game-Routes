import React from 'react';
import { MessageCircle, MessageSquare } from 'lucide-react';

const FloatingContact = () => {
  return (
    <div className="fixed bottom-30 right-8 flex flex-col gap-4 z-[999]">
      {/* WhatsApp */}
      <a href="https://wa.me/yournumber" target="_blank" className="bg-green-500 p-4 rounded-full text-white shadow-2xl hover:scale-110 transition-transform active:scale-95">
        <MessageCircle size={24} />
      </a>
    </div>
  );
};

export default FloatingContact;