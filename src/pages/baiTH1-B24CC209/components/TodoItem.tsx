import React from 'react';
import { List, Button, Typography } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Props {
  todo: { id: number; text: string };
  onEdit: (todo: { id: number; text: string }) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<Props> = ({ todo, onEdit, onDelete }) => {
  return (
    <List.Item
      actions={[
        // Nút Sửa
        <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(todo)}>Sửa</Button>,
        // Nút Xóa
        <Button type="link" danger icon={<DeleteOutlined />} onClick={() => onDelete(todo.id)}>Xóa</Button>
      ]}
    >
      <Typography.Text>{todo.text}</Typography.Text>
    </List.Item>
  );
};

export default TodoItem;