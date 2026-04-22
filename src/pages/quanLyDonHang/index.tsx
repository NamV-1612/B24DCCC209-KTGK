import React, { useEffect, useState, useMemo } from 'react';
import { useModel } from 'umi';
import {
  Button,
  Card,
  Space,
  Popconfirm,
  message,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Modal,
  Statistic,
  Progress,
  Empty,
  Spin,
} from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import FormDonHang from './components/FormDonHang';
import { TrangThaiDonHang, DonHang } from '@/models/donHangModel';
import './style.less';

const QuanLyDonHangPage: React.FC = () => {
  const { danhSach, dangTai, layDanhSach, themMoi, capNhat, xoa } = useModel('donHangModel');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DonHang | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailRecord, setDetailRecord] = useState<DonHang | null>(null);

  // Bộ lọc và tìm kiếm
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string>('ngayDat_desc'); // ngayDat_asc, ngayDat_desc, tien_asc, tien_desc

  // Lọc và tìm kiếm dữ liệu
  const filteredData = useMemo(() => {
    let result = [...danhSach];

    // Tìm kiếm theo mã đơn hàng hoặc tên khách hàng
    if (searchText) {
      result = result.filter(
        item =>
          item.maDonHang.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tenKhachHang.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Lọc theo trạng thái
    if (filterStatus) {
      result = result.filter(item => item.trangThai === filterStatus);
    }

    // Sắp xếp
    result.sort((a, b) => {
      if (sortBy === 'ngayDat_desc') {
        return new Date(b.ngayDatHang).getTime() - new Date(a.ngayDatHang).getTime();
      } else if (sortBy === 'ngayDat_asc') {
        return new Date(a.ngayDatHang).getTime() - new Date(b.ngayDatHang).getTime();
      } else if (sortBy === 'tien_desc') {
        return b.tongTien - a.tongTien;
      } else if (sortBy === 'tien_asc') {
        return a.tongTien - b.tongTien;
      }
      return 0;
    });

    return result;
  }, [danhSach, searchText, filterStatus, sortBy]);

  useEffect(() => {
    layDanhSach();
  }, []);

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const handleOpenEdit = (record: DonHang) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleShowDetail = (record: DonHang) => {
    setDetailRecord(record);
    setDetailVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await xoa(id);
      message.success('Hủy đơn hàng thành công!');
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleFormSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        await capNhat(editingRecord.id, values);
        message.success('Cập nhật đơn hàng thành công!');
      } else {
        await themMoi(values);
        message.success('Thêm đơn hàng thành công!');
      }
      setIsModalVisible(false);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // Thống kê
  const stats = useMemo(() => {
    return {
      total: danhSach.length,
      choXacNhan: danhSach.filter(d => d.trangThai === TrangThaiDonHang.CHO_XAC_NHAN).length,
      dangGiao: danhSach.filter(d => d.trangThai === TrangThaiDonHang.DANG_GIAO).length,
      hoanThanh: danhSach.filter(d => d.trangThai === TrangThaiDonHang.HOAN_THANH).length,
      huy: danhSach.filter(d => d.trangThai === TrangThaiDonHang.HUY).length,
    };
  }, [danhSach]);

  const getStatusColor = (status: TrangThaiDonHang) => {
    const colorMap: Record<TrangThaiDonHang, { bg: string; border: string; text: string; progress: string }> = {
      [TrangThaiDonHang.CHO_XAC_NHAN]: { bg: '#f5f5f5', border: '#bfbfbf', text: '#262626', progress: '#8c8c8c' },
      [TrangThaiDonHang.DANG_GIAO]: { bg: '#fffbe6', border: '#ffe58f', text: '#874d00', progress: '#faad14' },
      [TrangThaiDonHang.HOAN_THANH]: { bg: '#f6ffed', border: '#b7eb8f', text: '#274916', progress: '#52c41a' },
      [TrangThaiDonHang.HUY]: { bg: '#fff1f0', border: '#ffccc7', text: '#5c2c2c', progress: '#ff4d4f' },
    };
    return colorMap[status];
  };

  const getStatusLabel = (status: TrangThaiDonHang) => {
    const labelMap: Record<TrangThaiDonHang, string> = {
      [TrangThaiDonHang.CHO_XAC_NHAN]: 'Chờ xác nhận',
      [TrangThaiDonHang.DANG_GIAO]: 'Đang giao',
      [TrangThaiDonHang.HOAN_THANH]: 'Hoàn thành',
      [TrangThaiDonHang.HUY]: 'Hủy',
    };
    return labelMap[status];
  };

  return (
    <div className="quan-ly-don-hang">
      <Card
        title="Quản lý đơn hàng"
        extra={
          <Button type="primary" onClick={handleOpenAdd}>
            + Thêm đơn hàng mới
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        {/* Thống kê */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <Statistic
                title="Tổng số đơn hàng"
                value={stats.total}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: '#262626' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-pending">
              <Statistic
                title="Chờ xác nhận"
                value={stats.choXacNhan}
                valueStyle={{ color: '#8c8c8c' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-delivery">
              <Statistic
                title="Đang giao"
                value={stats.dangGiao}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-completed">
              <Statistic
                title="Hoàn thành"
                value={stats.hoanThanh}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card stat-cancelled">
              <Statistic
                title="Hủy"
                value={stats.huy}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Bộ lọc và tìm kiếm */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Tìm theo mã hoặc tên khách hàng"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              options={[
                { label: 'Chờ xác nhận', value: TrangThaiDonHang.CHO_XAC_NHAN },
                { label: 'Đang giao', value: TrangThaiDonHang.DANG_GIAO },
                { label: 'Hoàn thành', value: TrangThaiDonHang.HOAN_THANH },
                { label: 'Hủy', value: TrangThaiDonHang.HUY },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: 'Ngày đặt (Mới nhất)', value: 'ngayDat_desc' },
                { label: 'Ngày đặt (Cũ nhất)', value: 'ngayDat_asc' },
                { label: 'Tổng tiền (Cao nhất)', value: 'tien_desc' },
                { label: 'Tổng tiền (Thấp nhất)', value: 'tien_asc' },
              ]}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Grid danh sách đơn hàng */}
      <Spin spinning={dangTai}>
        {filteredData.length === 0 ? (
          <Empty description="Không có đơn hàng nào" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredData.map((order) => {
              const statusColor = getStatusColor(order.trangThai);
              const statusLabel = getStatusLabel(order.trangThai);
              const progressMap: Record<TrangThaiDonHang, number> = {
                [TrangThaiDonHang.CHO_XAC_NHAN]: 25,
                [TrangThaiDonHang.DANG_GIAO]: 75,
                [TrangThaiDonHang.HOAN_THANH]: 100,
                [TrangThaiDonHang.HUY]: 0,
              };

              return (
                <Col key={order.id} xs={24} sm={12} lg={8}>
                  <Card
                    className="order-card"
                    style={{
                      borderLeft: `4px solid ${statusColor.progress}`,
                      backgroundColor: statusColor.bg,
                      borderColor: statusColor.border,
                      cursor: 'pointer',
                      height: '100%',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Header */}
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#8c8c8c' }}>Mã đơn hàng</div>
                        <div style={{ fontSize: 16, fontWeight: 'bold', color: statusColor.text }}>
                          {order.maDonHang}
                        </div>
                      </div>
                      <Tag color={statusColor.progress}>{statusLabel}</Tag>
                    </div>

                    {/* Khách hàng */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Khách hàng</div>
                      <div style={{ fontSize: 14, fontWeight: 'bold', color: statusColor.text, wordBreak: 'break-word' }}>
                        {order.tenKhachHang}
                      </div>
                    </div>

                    {/* Ngày đặt */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Ngày đặt hàng</div>
                      <div style={{ fontSize: 13, color: statusColor.text }}>
                        {new Date(order.ngayDatHang).toLocaleDateString('vi-VN')}
                      </div>
                    </div>

                    {/* Tổng tiền */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>Tổng tiền</div>
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: statusColor.progress }}>
                        {order.tongTien.toLocaleString('vi-VN')} VND
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginBottom: 12 }}>
                      <Progress
                        percent={progressMap[order.trangThai]}
                        strokeColor={statusColor.progress}
                        status={order.trangThai === TrangThaiDonHang.HUY ? 'exception' : 'active'}
                        showInfo={false}
                      />
                      <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4, textAlign: 'center' }}>
                        {order.trangThai === TrangThaiDonHang.CHO_XAC_NHAN && 'Chờ xác nhận đơn hàng'}
                        {order.trangThai === TrangThaiDonHang.DANG_GIAO && 'Đang giao hàng đến khách'}
                        {order.trangThai === TrangThaiDonHang.HOAN_THANH && 'Đơn hàng đã hoàn thành'}
                        {order.trangThai === TrangThaiDonHang.HUY && 'Đơn hàng đã bị hủy'}
                      </div>
                    </div>

                    {/* Nút thao tác */}
                    <Space style={{ width: '100%' }} direction="vertical" size="small">
                      <Button
                        type="primary"
                        ghost
                        block
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleShowDetail(order)}
                      >
                        Chi tiết
                      </Button>
                      <Space style={{ width: '100%' }}>
                        <Button
                          type="primary"
                          ghost
                          style={{ flex: 1 }}
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleOpenEdit(order)}
                        >
                          Sửa
                        </Button>
                        <Popconfirm
                          title={
                            order.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN
                              ? 'Chỉ có thể hủy đơn hàng ở trạng thái "Chờ xác nhận"!'
                              : 'Bạn có chắc muốn hủy đơn hàng này không?'
                          }
                          onConfirm={() => handleDelete(order.id)}
                          okText="Có"
                          cancelText="Không"
                          disabled={order.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN}
                        >
                          <Button
                            type="primary"
                            danger
                            ghost
                            style={{ flex: 1 }}
                            size="small"
                            icon={<DeleteOutlined />}
                            disabled={order.trangThai !== TrangThaiDonHang.CHO_XAC_NHAN}
                          >
                            Hủy
                          </Button>
                        </Popconfirm>
                      </Space>
                    </Space>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Spin>

      {/* Modal thêm/sửa */}
      <FormDonHang
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onFinish={handleFormSubmit}
        initialData={editingRecord || undefined}
      />

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết đơn hàng"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {detailRecord && (
          <div style={{ lineHeight: 2 }}>
            <p>
              <strong>Mã đơn hàng:</strong> {detailRecord.maDonHang}
            </p>
            <p>
              <strong>Khách hàng:</strong> {detailRecord.tenKhachHang}
            </p>
            <p>
              <strong>Ngày đặt hàng:</strong>{' '}
              {new Date(detailRecord.ngayDatHang).toLocaleDateString('vi-VN')}
            </p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              <Tag color={getStatusColor(detailRecord.trangThai).progress}>
                {getStatusLabel(detailRecord.trangThai)}
              </Tag>
            </p>
            <p>
              <strong>Sản phẩm:</strong>
            </p>
            <div style={{ marginLeft: 20 }}>
              {detailRecord.sanPham.map((sp, idx) => (
                <div key={idx}>
                  {idx + 1}. {sp.tenSanPham} - Số lượng: {sp.soLuong} - Giá:{' '}
                  {sp.gia.toLocaleString('vi-VN')} VND - Thành tiền:{' '}
                  {(sp.gia * sp.soLuong).toLocaleString('vi-VN')} VND
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 16, fontWeight: 'bold' }}>
              <strong>Tổng tiền:</strong> {detailRecord.tongTien.toLocaleString('vi-VN')}{' '}
              VND
            </p>
            {detailRecord.ghiChu && (
              <p>
                <strong>Ghi chú:</strong> {detailRecord.ghiChu}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuanLyDonHangPage;
