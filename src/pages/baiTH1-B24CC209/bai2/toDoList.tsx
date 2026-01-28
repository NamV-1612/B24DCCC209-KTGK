import React, { useState, useEffect } from 'react';
import { Card, Input, Button, List, message } from 'antd';
import TodoItem from '../components/TodoItem'; // import 

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<{ id: number; text: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null); // chỉnh tên trên thanh thêm CV

  // lấy dữ liệu từ localStorage khi load trang
  useEffect(() => {
    const data = localStorage.getItem('B24DCCC209_todos');
    if (data) {
      setTodos(JSON.parse(data));
    }
  }, []);

  // lưu vào localStorage 
  useEffect(() => {
    localStorage.setItem('B24DCCC209_todos', JSON.stringify(todos));
  }, [todos]);

  // Thêm hoặc Cập nhật
  const handleSave = () => {
    if (!inputValue.trim()) {
      message.error('Vui lòng nhập nội dung!');
      return;
    }

    if (editingId) {
      // Logic sửa
      setTodos(todos.map(t => t.id === editingId ? { ...t, text: inputValue } : t));
      setEditingId(null);
      message.success('Đã cập nhật!');
    } else {
      // Logic thêm 
      const newItem = { id: Date.now(), text: inputValue };
      setTodos([...todos, newItem]);
      message.success('Đã thêm!');
    }
    setInputValue('');
  };

  // Sửa
  const startEdit = (todo: { id: number; text: string }) => {
    setEditingId(todo.id);
    setInputValue(todo.text);
  };

  // Xóa
  const handleDelete = (id: number) => {
    setTodos(todos.filter(item => item.id !== id));
    message.success('Đã xóa!');
  };

  return (
    <Card title="BÀI 2: TODOLIST (LƯU LOCALSTORAGE)">
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <Input 
          placeholder="Nhập công việc..." 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSave}
        />
        <Button type="primary" onClick={handleSave}>
          {editingId ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>

      <List
        bordered
        dataSource={todos}
        renderItem={(item) => (
          <TodoItem 
            todo={item} 
            onEdit={startEdit} 
            onDelete={handleDelete} 
          />
        )}
      />
    </Card>
  );
};

export default TodoList;