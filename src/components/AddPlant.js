import React, { useState, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import {
  Input,
  Button,
  Space,
  List,
  Avatar,
  Skeleton,
  Steps,
  Form,
  message,
} from 'antd';
import {
  RollbackOutlined,
  SearchOutlined,
  FormOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import { createPlant, searchPlants, createLocation } from 'api/plants';
import './AddPlant.css';

const { Step } = Steps;

export default function AddPlant() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const history = useHistory();

  const delayedSearch = useCallback(
    debounce(async (q) => {
      setLoading(true);
      const response = await searchPlants(q);
      setSearchResults(response.data.data);
      setLoading(false);
    }, 500),
    [],
  );

  const onSearch = async (e) => {
    delayedSearch(e.target.value);
  };

  const onSelectPlant = (plant) => {
    setSelectedPlant(plant);
    setStep(1);
  };

  const onFormSubmit = async ({ name, wateringTimeframe, location }) => {
    setSubmitting(true);
    const payload = {
      name,
      wateringTimeframe,
      meta: selectedPlant,
    };

    try {
      const response = await createPlant(payload);
      await createLocation(response.data, location);
      message.success(`I've added a ${name} to your list.`);
      // history.push('/');
    } catch (e) {
      message.error(`I've failed to add new plant, please check server logs.`);
    }

    setSubmitting(false);
  };

  const Search = () => (
    <Space size={24} direction="vertical" style={{ width: '100%' }}>
      {loading && (
        <>
          <Skeleton loading={true} active avatar></Skeleton>
          <Skeleton loading={true} active avatar></Skeleton>
          <Skeleton loading={true} active avatar></Skeleton>
        </>
      )}
      {!loading && (
        <List
          itemLayout="vertical"
          dataSource={searchResults}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <Button type="primary" onClick={() => onSelectPlant(item)}>
                  Select
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={item.image_url} size={96} />}
                title={item.common_name}
                description={`${item.synonyms.join(', ').substring(0, 64)}...`}
              />
            </List.Item>
          )}
        />
      )}
    </Space>
  );

  const FillOut = () => (
    <Space size={24} direction="vertical" style={{ width: '100%' }}>
      <Avatar size={96} src={selectedPlant.image_url} />
      <Form
        layout="vertical"
        form={form}
        initialValues={{ name: selectedPlant.common_name }}
        onFinish={onFormSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input plant name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Where is it placed?"
          name="location"
          rules={[{ required: true, message: 'Please input plant location!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="How often do you want to water it?"
          name="wateringTimeframe"
          rules={[
            { required: true, message: 'Please input watering timeframe!' },
          ]}
        >
          <Input prefix="Every" type="number" suffix="days" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Add plant
          </Button>
        </Form.Item>
      </Form>
    </Space>
  );

  return (
    <div>
      <div style={{ textAlign: 'left', marginTop: '16px' }}>
        <Link to="/">
          <RollbackOutlined /> Back
        </Link>
      </div>
      <Space size={24} direction="vertical" style={{ width: '100%' }}>
        <Steps>
          <Step
            status={step > 0 ? 'finish' : 'process'}
            title="Search"
            icon={<SearchOutlined />}
          />
          <Step
            status={step > 0 ? 'process' : 'wait'}
            title="Fill out"
            icon={<FormOutlined />}
          />
          <Step status="wait" title="Done" icon={<SmileOutlined />} />
        </Steps>
        {step === 0 && (
          <Input
            placeholder="Start typing your plant name..."
            onChange={onSearch}
          />
        )}
        {step === 0 && <Search />}
        {step === 1 && <FillOut />}
      </Space>
    </div>
  );
}
