import React from 'react';

const communicationIcons = [
  { value: 'fas fa-comments', label: 'Comments' },
  { value: 'fas fa-comment-dots', label: 'Comment Dots' },
  { value: 'fas fa-phone', label: 'Phone' },
  { value: 'fas fa-video', label: 'Video' },
  { value: 'fas fa-microphone', label: 'Microphone' },
  { value: 'fas fa-headset', label: 'Headset' },
  { value: 'fas fa-bullhorn', label: 'Bullhorn' },
  { value: 'fas fa-envelope', label: 'Envelope' },
  { value: 'fas fa-user-friends', label: 'User Friends' },
  { value: 'fas fa-chalkboard-teacher', label: 'Teacher' },
  { value: 'fas fa-user', label: 'User' },
  { value: 'fas fa-user-tie', label: 'User Tie' },
  { value: 'fas fa-users', label: 'Users' },
  { value: 'fas fa-question-circle', label: 'Question Circle' },
  // Additional communication skill-related icons
  { value: 'fas fa-hand-paper', label: 'Hand Gesture' },
  { value: 'fas fa-handshake', label: 'Handshake' },
  { value: 'fas fa-ear-listen', label: 'Listening' },
  { value: 'fas fa-volume-up', label: 'Speaking' },
  { value: 'fas fa-chalkboard', label: 'Presentation' },
  { value: 'fas fa-people-arrows', label: 'Collaboration' },
  { value: 'fas fa-heart', label: 'Empathy' },
  { value: 'fas fa-lightbulb', label: 'Idea' },
  { value: 'fas fa-brain', label: 'Thinking' },
  { value: 'fas fa-hands-helping', label: 'Helping' },
  { value: 'fas fa-language', label: 'Language' },
  { value: 'fas fa-smile', label: 'Smile' },
  { value: 'fas fa-eye', label: 'Eye Contact' },
  { value: 'fas fa-people-group', label: 'Group' },
  { value: 'fas fa-handshake-angle', label: 'Negotiation' },
  { value: 'fas fa-people-carry-box', label: 'Teamwork' },
  { value: 'fas fa-hands-clapping', label: 'Applause' },
  { value: 'fas fa-person-chalkboard', label: 'Trainer' },
  { value: 'fas fa-person-rays', label: 'Confidence' },
];

interface IconSelectorProps {
  value: string;
  onChange: (icon: string) => void;
}

const IconSelector: React.FC<IconSelectorProps> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {communicationIcons.map((icon) => (
        <button
          type="button"
          key={icon.value}
          onClick={() => onChange(icon.value)}
          style={{
            border: value === icon.value ? '2px solid #3B82F6' : '1px solid #ddd',
            borderRadius: 6,
            padding: 10,
            background: value === icon.value ? '#EFF6FF' : '#fff',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 60,
          }}
        >
          <i className={icon.value} style={{ fontSize: 24, marginBottom: 4, color: value === icon.value ? '#2563EB' : '#555' }}></i>
          <span style={{ fontSize: 12 }}>{icon.label}</span>
        </button>
      ))}
    </div>
  );
};

export default IconSelector; 