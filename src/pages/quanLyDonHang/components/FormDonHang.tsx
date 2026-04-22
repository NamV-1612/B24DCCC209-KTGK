import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Space,
  message,
} from 'antd';
import moment from 'moment';
import {
  TrangThaiDonHang,
  DonHang,
  SanPhamChon,
  getKhachHangList,
  getSanPhamList,
} from '@/models/donHangModel';

interface FormDonHangProps {
  visible: boolean;
  onClose: () => void;
  onFinish: (values: any) => void;
  initialData?: DonHang;
}

const FormDonHang: React.FC<FormDonHangProps> = ({
  visible,
  onClose,
  onFinish,
  initialData,
}) => {
  const [form] = Form.useForm();
  const [sanPhamChon, setSanPhamChon] = React.useState<SanPhamChon[]>([]);
  const [sanPhamId, setSanPhamId] = React.useState<string>('');
  const [soLuong, setSoLuong] = React.useState<number>(1);

  const khachHangList = getKhachHangList();
  const sanPhamList = getSanPhamList();

  // Tính tổng tiền
  const tongTien = useMemo(() => {
    return sanPhamChon.reduce((sum, sp) => sum + sp.gia * sp.soLuong, 0);
  }, [sanPhamChon]);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue({
          maDonHang: initialData.maDonHang,
          khachHangId: initialData.khachHangId,
          ngayDatHang: moment(initialData.ngayDatHang),
          trangThai: initialData.trangThai,
          ghiChu: initialData.ghiChu,
        });
        setSanPhamChon(initialData.sanPham);
      } else {
        form.resetFields();
        setSanPhamChon([]);
        setSanPhamId('');
        setSoLuong(1);
      }
    }
  }, [visible, initialData, form]);

  const handleAddProduct = () => {
    if (!sanPhamId) {
      message.warning('Vui lòng chọn sản phẩm!');
      return;
    }

    if (soLuong <= 0) {
      message.warning('Số lượng phải lớn hơn 0!');
      return;
    }

    // Kiểm tra sản phẩm đã tồn tại chưa
    const sanPhamDaChon = sanPhamChon.find(sp => sp.id === sanPhamId);
    if (sanPhamDaChon) {
      // Cập nhật số lượng nếu sản phẩm đã tồn tại
      setSanPhamChon(
        sanPhamChon.map(sp =>
          sp.id === sanPhamId
            ? { ...sp, soLuong: sp.soLuong + soLuong }
            : sp
        )
      );
    } else {
      // Thêm sản phẩm mới
      const sanPham = sanPhamList.find(sp => sp.id === sanPhamId);
      if (sanPham) {
        setSanPhamChon([
          ...sanPhamChon,
          {
            id: sanPham.id,
            tenSanPham: sanPham.ten,
            gia: sanPham.gia,
            soLuong,
          },
        ]);
      }
    }

    setSanPhamId('');
    setSoLuong(1);
  };

  const handleRemoveProduct = (id: string) => {
    setSanPhamChon(sanPhamChon.filter(sp => sp.id !== id));
  };

  const handleFormSubmit = () => {
    if (sanPhamChon.length === 0) {
      message.warning('Vui lòng chọn ít nhất một sản phẩm!');
      return;
    }

    form.submit();
  };

  const onFormFinish = (values: any) => {
    const submittedData = {
      ...values,
      ngayDatHang: values.ngayDatHang.format('YYYY-MM-DD'),
      sanPham: sanPhamChon,
      tongTien,
      tenKhachHang: khachHangList.find(kh => kh.id === values.khachHangId)?.ten || '',
    };
    onFinish(submittedData);
  };

  const productColumns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'tenSanPham',
      key: 'tenSanPham',
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'gia',
      key: 'gia',
      render: (gia: number) => gia.toLocaleString('vi-VN'),
    },
    {
      title: 'Số lượng',
      dataIndex: 'soLuong',
      key: 'soLuong',
    },
    {
      title: 'Thành tiền (VND)',
      key: 'thanhTien',
      render: (_: any, record: SanPhamChon) =>
        (record.gia * record.soLuong).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: SanPhamChon) => (
        <Button
          type="primary"
          danger
          size="small"
          onClick={() => handleRemoveProduct(record.id)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={
        initialData ? 'Sửa thông tin đơn hàng' : 'Thêm đơn hàng mới'
      }
      visible={visible}
      onCancel={onClose}
      onOk={handleFormSubmit}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFormFinish}
      >
        <Form.Item
          name="maDonHang"
          label="Mã đơn hàng"
          rules={[
            { required: true, message: 'Vui lòng nhập mã đơn hàng!' },
            { pattern: /^[A-Z0-9]+$/, message: 'Mã đơn hàng chỉ chứa chữ hoa và số!' },
          ]}
        >
          <Input
            placeholder="Ví dụ: DH001"
            disabled={!!initialData}
          />
        </Form.Item>

        <Form.Item
          name="khachHangId"
          label="Khách hàng"
          rules={[{ required: true, message: 'Vui lòng chọn khách hàng!' }]}
        >
          <Select
            placeholder="Chọn khách hàng"
            options={khachHangList.map(kh => ({
              label: kh.ten,
              value: kh.id,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="ngayDatHang"
          label="Ngày đặt hàng"
          rules={[{ required: true, message: 'Vui lòng chọn ngày đặt hàng!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select
            placeholder="Chọn trạng thái"
            options={[
              { label: 'Chờ xác nhận', value: TrangThaiDonHang.CHO_XAC_NHAN },
              { label: 'Đang giao', value: TrangThaiDonHang.DANG_GIAO },
              { label: 'Hoàn thành', value: TrangThaiDonHang.HOAN_THANH },
              { label: 'Hủy', value: TrangThaiDonHang.HUY },
            ]}
          />
        </Form.Item>

        <Form.Item label="Sản phẩm">
          <Space style={{ width: '100%' }} direction="vertical">
            <Space style={{ marginBottom: 16 }}>
              <Select
                style={{ width: 300 }}
                placeholder="Chọn sản phẩm"
                value={sanPhamId || undefined}
                onChange={setSanPhamId}
                options={sanPhamList.map(sp => ({
                  label: `${sp.ten} (${sp.gia.toLocaleString('vi-VN')} VND)`,
                  value: sp.id,
                }))}
              />
              <InputNumber
                min={1}
                value={soLuong}
                onChange={value => setSoLuong(value || 1)}
                placeholder="Số lượng"
                style={{ width: 100 }}
              />
              <Button type="primary" onClick={handleAddProduct}>
                Thêm
              </Button>
            </Space>

            {sanPhamChon.length > 0 && (
              <>
                <Table
                  columns={productColumns}
                  dataSource={sanPhamChon}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  bordered
                />
                <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
                  Tổng tiền: {tongTien.toLocaleString('vi-VN')} VND
                </div>
              </>
            )}
          </Space>
        </Form.Item>

        <Form.Item name="ghiChu" label="Ghi chú">
          <Input.TextArea rows={3} placeholder="Ghi chú thêm (nếu có)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FormDonHang;
