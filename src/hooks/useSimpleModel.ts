import { useState } from 'react';

export default function useSimpleModel<T>() {
  const [danhSach, setDanhSach] = useState<T[]>([]);
  const [dangTai, setDangTai] = useState<boolean>(false);

  // Lấy danh sách (Có sẵn dữ liệu mẫu)
  const layDanhSach = async () => {
    setDangTai(true);
    setTimeout(() => {
      const dataMau = [
        { id: '1', nam: 2024, soVaoSoHienTai: 150 },
        { id: '2', nam: 2025, soVaoSoHienTai: 320 },
      ] as unknown as T[]; 
      setDanhSach(dataMau);
      setDangTai(false);
    }, 500);
  };

  // Thêm mới
  const themMoi = async (duLieu: any) => {
    const banGhiMoi = { ...duLieu, id: Date.now().toString() };
    setDanhSach([banGhiMoi, ...danhSach]); // Nhét cái mới lên đầu bảng
  };

  // Cập nhật (Sửa)
  const capNhat = async (id: string, duLieuMoi: any) => {
    const danhSachMoi = danhSach.map((item: any) => 
      item.id === id ? { ...item, ...duLieuMoi } : item
    );
    setDanhSach(danhSachMoi);
  };

  // Xóa
  const xoa = async (id: string) => {
    const danhSachMoi = danhSach.filter((item: any) => item.id !== id);
    setDanhSach(danhSachMoi);
  };

  return { danhSach, dangTai, layDanhSach, themMoi, capNhat, xoa };
}