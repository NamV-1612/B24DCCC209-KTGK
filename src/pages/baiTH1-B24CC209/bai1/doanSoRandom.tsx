import React, { useState, useEffect } from 'react';
import { Card, message, List, Typography } from 'antd';
import GuessInput from '../components/GuessInput'; // comp dữ liệu nhập vào


const { Title, Text } = Typography;

const DoanSoRandom: React.FC = () => {
  const [target, setTarget] = useState<number>(0); // số cần đoán
  const [guess, setGuess] = useState<string>('');  // số người dùng nhập
  const [attempts, setAttempts] = useState<number>(0); // lượt thử
  const [history, setHistory] = useState<string[]>([]); // manh mối (lịch sử) các lần đoán
  const [gameOver, setGameOver] = useState<boolean>(false); // kết quả

  // khởi tạo game mới khi vào trang
  useEffect(() => {
    resetGame();
  }, []);

  // tạo mới trò chơi
  const resetGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1); // Sinh số 1-100
    setAttempts(0);
    setHistory([]);
    setGuess('');
    setGameOver(false);
  };

  // hàm xử lý logic người dùng nhập
  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      message.warning('Bạn phải nhập số từ 1 đến 100!');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let resultMsg = `Lượt ${newAttempts}: ${num} -> `;
    
    // Logic so sánh 
    if (num < target) {
      resultMsg += 'Bạn đoán quá thấp!';
    } else if (num > target) {
      resultMsg += 'Bạn đoán quá cao!';
    } else {
      resultMsg += 'Chúc mừng! Bạn đã đoán đúng!';
      message.success('Thắng rồi!');
      setGameOver(true);
    }

    // Kiểm tra số lượt
    if (newAttempts >= 10 && num !== target) {
      resultMsg = `Hết lượt! Số đúng là ${target}.`;
      message.error('Bạn đã thua!');
      setGameOver(true);
    }

    setHistory([resultMsg, ...history]); 
    setGuess('');
  };

  return (
    <Card title="Số gì đây la con số gì đây">
      <Title level={4}>Lượt đoán còn lại: {attempts}/10</Title>
    
      <GuessInput 
        value={guess} 
        onChange={setGuess} 
        onGuess={handleGuess} 
        disabled={gameOver} 
      />

      {gameOver && <button onClick={resetGame} style={{marginBottom: 10}}>Chơi lại</button>}

      <List
        header={<b>Manh mối</b>}
        bordered
        dataSource={history}
        renderItem={(item) => (
          <List.Item>
            <Text style={{ color: item.includes('đúng') ? 'green' : 'red' }}>{item}</Text>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default DoanSoRandom;