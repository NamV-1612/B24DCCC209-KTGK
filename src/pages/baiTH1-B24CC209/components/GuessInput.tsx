import React from 'react';
import { Input, Button } from 'antd';


interface Props {
  value: string;
  onChange: (val: string) => void;
  onGuess: () => void;
  disabled: boolean;
}

const GuessInput: React.FC<Props> = ({ value, onChange, onGuess, disabled }) => {
  return (
    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
      <Input 
        type="number" 
        placeholder="Nhập số từ 1-100"
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onPressEnter={onGuess}
      />
      <Button type="primary" onClick={onGuess} disabled={disabled}>
        Đoán
      </Button>
    </div>
  );
};

export default GuessInput;