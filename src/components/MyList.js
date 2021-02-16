import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Space,
  Card,
  Avatar,
  Breadcrumb,
  Skeleton,
  Modal,
  message,
} from 'antd';
import {
  EditOutlined,
  ThunderboltOutlined,
  ThunderboltTwoTone,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { getPlants, deletePlant } from 'api/plants';
import icon from 'images/icon.png';

const { confirm } = Modal;

export default function MyList() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const asyncCall = async () => {
      const response = await getPlants();
      setPlants(response.data);
      setLoading(false);
    };

    asyncCall();
  }, []);

  const onDelete = async (plant) => {
    try {
      confirmDelete(async () => {
        await deletePlant(plant.id);
        const response = await getPlants();
        setPlants(response.data);
        message.success(`I've removed ${plant.name} from your list`);
      });
    } catch {
      message.error(`I've failed to remove ${plant.name} from your list`);
    }
  };

  const confirmDelete = (confirmAction) => {
    confirm({
      title: 'Do you want to delete this plant?',
      icon: <ExclamationCircleOutlined />,
      content: 'All data will be permanently lost',
      onOk() {
        return confirmAction();
      },
    });
  };

  return (
    <Space space={24} direction="vertical" style={{ width: '100%' }}>
      <Breadcrumb>
        <Breadcrumb.Item>
          <img src={icon} width={32} style={{ marginRight: 4 }} />
          <Link to="/">
            <span>My plants</span>
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ textAlign: 'right' }}>
        <Link to="/add-plant">Add new plant</Link>
      </div>
      {loading && (
        <Card
          actions={[
            <ThunderboltOutlined key="water" />,
            <EditOutlined key="edit" />,
            <DeleteOutlined key="ellipsis" />,
          ]}
        >
          <Skeleton loading={loading} avatar active></Skeleton>
        </Card>
      )}
      {plants.length === 0 && <p>You have no plants!</p>}
      {plants.map((p) => (
        <Card
          actions={[
            <ThunderboltTwoTone key="water" />,
            <EditOutlined key="edit" />,
            <DeleteOutlined key="delete" onClick={() => onDelete(p)} />,
          ]}
        >
          <Card.Meta
            avatar={<Avatar size={56} src={p.meta.image_url} />}
            title={p.name}
            description={
              <>
                <p>Location: {p.location}</p>
                <p>Watering: Every {p.wateringTimeframe} days</p>
              </>
            }
          />
        </Card>
      ))}
    </Space>
  );
}
