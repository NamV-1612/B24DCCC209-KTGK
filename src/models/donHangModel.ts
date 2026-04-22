import { useState, useEffect } from 'react';

export enum TrangThaiDonHang {
  CHO_XAC_NHAN = 'CHO_XAC_NHAN',
  DANG_GIAO = 'DANG_GIAO',
  HOAN_THANH = 'HOAN_THANH',
  HUY = 'HUY',
}

export interface SanPhamChon {
  id: string;
  tenSanPham: string;
  gia: number;
  soLuong: number;
}

export interface DonHang {
  id: string;
  maDonHang: string;
  khachHangId: string;
  tenKhachHang: string;
  ngayDatHang: string;
  sanPham: SanPhamChon[];
  tongTien: number;
  trangThai: TrangThaiDonHang;
  ghiChu?: string;
}

const STORAGE_KEY = 'orders_data';

// Dữ liệu khách hàng mẫu
const KHACH_HANG_MAU = [
  { id: '1', ten: 'Nguyễn Văn A' },
  { id: '2', ten: 'Trần Thị B' },
  { id: '3', ten: 'Phạm Minh C' },
  { id: '4', ten: 'Lê Quang D' },
  { id: '5', ten: 'Hoàng Kim E' },
];

// Dữ liệu sản phẩm mẫu
const SAN_PHAM_MAU = [
  { id: '1', ten: 'Laptop Dell XPS 13', gia: 25000000 },
  { id: '2', ten: 'Mouse Logitech MX Master', gia: 2500000 },
  { id: '3', ten: 'Keyboard Mechanical RGB', gia: 3500000 },
  { id: '4', ten: 'Monitor LG 27 inch 4K', gia: 12000000 },
  { id: '5', ten: 'Cáp USB-C 2m', gia: 500000 },
  { id: '6', ten: 'Headphone Sony WH-1000XM5', gia: 8000000 },
  { id: '7', ten: 'Webcam Logitech C920', gia: 2000000 },
  { id: '8', ten: 'Bàn phím Wireless', gia: 1500000 },
];

// Dữ liệu mẫu đơn hàng
const DON_HANG_MAU: DonHang[] = [
  {
    id: '1',
    maDonHang: 'DH001',
    khachHangId: '1',
    tenKhachHang: 'Nguyễn Văn A',
    ngayDatHang: '2026-04-20',
    sanPham: [
      { id: '1', tenSanPham: 'Laptop Dell XPS 13', gia: 25000000, soLuong: 1 },
      { id: '2', tenSanPham: 'Mouse Logitech MX Master', gia: 2500000, soLuong: 2 },
    ],
    tongTien: 30000000,
    trangThai: TrangThaiDonHang.CHO_XAC_NHAN,
  },
  {
    id: '2',
    maDonHang: 'DH002',
    khachHangId: '2',
    tenKhachHang: 'Trần Thị B',
    ngayDatHang: '2026-04-18',
    sanPham: [
      { id: '4', tenSanPham: 'Monitor LG 27 inch 4K', gia: 12000000, soLuong: 1 },
    ],
    tongTien: 12000000,
    trangThai: TrangThaiDonHang.DANG_GIAO,
  },
  {
    id: '3',
    maDonHang: 'DH003',
    khachHangId: '3',
    tenKhachHang: 'Phạm Minh C',
    ngayDatHang: '2026-04-15',
    sanPham: [
      { id: '6', tenSanPham: 'Headphone Sony WH-1000XM5', gia: 8000000, soLuong: 1 },
      { id: '7', tenSanPham: 'Webcam Logitech C920', gia: 2000000, soLuong: 1 },
    ],
    tongTien: 10000000,
    trangThai: TrangThaiDonHang.HOAN_THANH,
  },
];

export function getKhachHangList() {
  return KHACH_HANG_MAU;
}

export function getSanPhamList() {
  return SAN_PHAM_MAU;
}

export function getDonHangMau() {
  return DON_HANG_MAU;
}

export default function donHangModel() {
  const [danhSach, setDanhSach] = useState<DonHang[]>([]);
  const [dangTai, setDangTai] = useState<boolean>(false);

  // Lấy danh sách từ localStorage hoặc dữ liệu mẫu
  const layDanhSach = async () => {
    setDangTai(true);
    setTimeout(() => {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        setDanhSach(JSON.parse(data));
      } else {
        const danhSachMau = getDonHangMau();
        setDanhSach(danhSachMau);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachMau));
      }
      setDangTai(false);
    }, 300);
  };

  // Thêm mới đơn hàng
  const themMoi = async (duLieu: Omit<DonHang, 'id'>) => {
    // Kiểm tra mã đơn hàng không trùng lặp
    if (danhSach.some(item => item.maDonHang === duLieu.maDonHang)) {
      throw new Error('Mã đơn hàng đã tồn tại!');
    }

    const banGhiMoi: DonHang = {
      ...duLieu,
      id: Date.now().toString(),
    };

    const danhSachMoi = [banGhiMoi, ...danhSach];
    setDanhSach(danhSachMoi);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachMoi));
  };

  // Cập nhật (Sửa) đơn hàng
  const capNhat = async (id: string, duLieuMoi: Partial<DonHang>) => {
    // Kiểm tra mã đơn hàng không trùng lặp (ngoại trừ bản ghi hiện tại)
    if (duLieuMoi.maDonHang) {
      const banGhiHienTai = danhSach.find(item => item.id === id);
      if (banGhiHienTai && banGhiHienTai.maDonHang !== duLieuMoi.maDonHang) {
        if (danhSach.some(item => item.maDonHang === duLieuMoi.maDonHang)) {
          throw new Error('Mã đơn hàng đã tồn tại!');
        }
      }
    }

    const danhSachMoi = danhSach.map((item: any) =>
      item.id === id ? { ...item, ...duLieuMoi } : item
    );
    setDanhSach(danhSachMoi);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachMoi));
  };

  // Xóa đơn hàng
  const xoa = async (id: string) => {
    const banGhiHienTai = danhSach.find(item => item.id === id);
    
    // Kiểm tra điều kiện: chỉ xóa được khi trạng thái là "Chờ xác nhận"
    if (banGhiHienTai && banGhiHienTai.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN) {
      throw new Error('Chỉ được hủy đơn hàng khi ở trạng thái "Chờ xác nhận"!');
    }

    const danhSachMoi = danhSach.filter((item: any) => item.id !== id);
    setDanhSach(danhSachMoi);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(danhSachMoi));
  };

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    layDanhSach();
  }, []);

  return {
    danhSach,
    dangTai,
    layDanhSach,
    themMoi,
    capNhat,
    xoa,
  };
}
