import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { avatarHTML } from '../../components/uiHelpers';

const i18n = window.i18n || { t: k => k };
const DUMMY = window.DUMMY || {};

export default function Pesan({ role }) {
  const [activeChat, setActiveChat] = useState(0);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'them', text: 'Halo Rizki, bagaimana progres untuk modul dashboard?', time: '10:25' },
    { sender: 'me', text: 'Halo! Hampir selesai, saya sedang melakukan final testing pada API integration.', time: '10:28' },
    { sender: 'them', text: 'Bagus. Apakah ada kendala pada sinkronisasi Azure?', time: '10:30' },
  ]);

  const MessagingService = window.MessagingService;

  useEffect(() => {
    // Connect and listen for real-time messages
    MessagingService.connect();
    const unsubscribe = MessagingService.subscribe((msg) => {
      if (msg.senderId !== (role === 'freelancer' ? 'FL-1' : 'EMP-1')) {
        setMessages(prev => [...prev, { sender: 'them', text: msg.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
    });
    return () => unsubscribe();
  }, [role]);

  const handleSend = async () => {
    if (!inputText.trim()) return;
    
    const myId = role === 'freelancer' ? 'FL-1' : 'EMP-1';
    const targetId = 'TARGET-1';

    // 1. Send via Service (Real-time + DB)
    await MessagingService.sendMessage(myId, targetId, inputText);

    // 2. Update local UI
    setMessages(prev => [...prev, { 
      sender: 'me', 
      text: inputText, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    
    setInputText('');
  };

  const chats = [
    { id: 0, name: 'TechCorp Solutions', lastMsg: 'Halo Rizki, apakah ada update?', time: '10:30', online: true, initials: 'TC' },
    { id: 1, name: 'CloudNet Global', lastMsg: 'Terima kasih atas revisinya.', time: 'Kemarin', online: false, initials: 'CN' }
  ];

  return (
    <div style={{ paddingTop: 68 }}>
      <Navbar role={role} />
      <div className="dashboard-layout active">
        <Sidebar role={role} activePath={`/${role}/pesan`} />
        
        <main className="main-content" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', padding: 0, height: 'calc(100vh - 68px)' }}>
          {/* Chat List */}
          <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.2rem' }}>{i18n.t('nav_messages')}</h2>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {chats.map((c, i) => (
                <div 
                  key={c.id} 
                  onClick={() => setActiveChat(i)}
                  style={{ 
                    padding: '16px 24px', cursor: 'pointer', 
                    background: activeChat === i ? 'rgba(108,99,255,0.08)' : 'transparent',
                    borderLeft: activeChat === i ? '4px solid var(--primary)' : '4px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <div dangerouslySetInnerHTML={{ __html: avatarHTML(c.initials, 'md') }} />
                      {c.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: 'var(--accent)', border: '2px solid var(--bg)', borderRadius: '50%' }}></div>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.lastMsg}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.01)' }}>
            {/* Header */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div dangerouslySetInnerHTML={{ __html: avatarHTML(chats[activeChat].initials, 'sm') }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{chats[activeChat].name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>{chats[activeChat].online ? 'Online' : 'Offline'}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">⚙️</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.sender === 'me' ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                  <div style={{ 
                    padding: '12px 16px', borderRadius: '16px', fontSize: '0.9rem',
                    background: m.sender === 'me' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: m.sender === 'me' ? '#fff' : 'var(--text)',
                    borderBottomRightRadius: m.sender === 'me' ? '4px' : '16px',
                    borderBottomLeftRadius: m.sender === 'me' ? '16px' : '4px'
                  }}>
                    {m.text}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: m.sender === 'me' ? 'right' : 'left' }}>{m.time}</div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-ghost btn-circle">📎</button>
                <input 
                  className="form-input" 
                  placeholder="Ketik pesan..." 
                  style={{ borderRadius: '24px' }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary btn-circle">📤</button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
