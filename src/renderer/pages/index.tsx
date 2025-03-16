import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Layout,
  Typography,
  List,
  Tag,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  FcDownload,
  FcDocument,
  FcDeleteRow,
  FcStart,
  FcBrokenLink,
  FcCancel,
  FcOk,
} from 'react-icons/fc';
import { FaPaste } from 'react-icons/fa';
import { useApiList } from '../hooks/useApiList';

const { Content } = Layout;
const { Title } = Typography;

const methodType = {
  get: <Tag color="green">get</Tag>,
  post: <Tag color="blue">post</Tag>,
  put: <Tag color="cyan">put</Tag>,
  delete: <Tag color="red">delete</Tag>,
};

const statusType = {
  success: <FcOk />,
  faild: <FcCancel />,
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 170,
  },
  {
    title: 'Mock Server Address',
    dataIndex: 'serverAddress',
    key: 'serverAddress',
    render: (text) => (
      <a href={text} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
    render: (text) => statusType[text],
    width: 60,
  },
  {
    title: 'Actions',
    key: 'actions',
    align: 'center',
    render: (_, record) => (
      <Space>
        <Button
          icon={<FcStart />}
          onClick={() => message.info(`Viewing spec for ${record.name}`)}
        >
          play
        </Button>
        <Button icon={<FcBrokenLink />}>stop</Button>
        <Button icon={<FcDeleteRow />}>Remove</Button>
      </Space>
    ),
    width: 320,
  },
  {
    title: 'Reference',
    key: 'reference',
    align: 'center',
    render: (_, record) => (
      <Space>
        <Button
          icon={<FcDocument />}
          onClick={() => message.info(`Viewing spec for ${record.name}`)}
        >
          yaml
        </Button>
        <Button
          icon={<FcDocument />}
          onClick={() => message.info(`Viewing spec for ${record.name}`)}
        >
          json
        </Button>
        <Button icon={<FaPaste />}>schema</Button>
        <Button download icon={<FcDownload />}>
          schema
        </Button>
      </Space>
    ),
    width: 430,
  },
];

const initialData = Array.from({ length: 25 }, (_, i) => ({
  key: i,
  name: `File_${i + 1}.d.ts`,
  serverAddress: ``,
  status: i % 2 === 0 ? 'success' : 'faild',
  apiList: [
    {
      method: 'get',
      url: '/api/v1/users',
    },
  ],
}));

const Main = () => {
  const [fileList, setFileList] = useState(initialData);
  const [port, setPort] = useState(4200);
  const { apiList } = useApiList()

  const serverUrl = useMemo(() => {
    return `http://localhost:${port}`;
  }, [port]);

  useEffect(() => {
    window.api.sendMessage('host').then(({ data }: any) => {
      setPort(data);
    });
  }, []);

  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Title level={3}>
            server:{' '}
            <a href={serverUrl} target="_blank" rel="noopener noreferrer">
              {serverUrl}
            </a>
          </Title>
        </div>
        <Space style={{ marginBottom: '16px' }}>
          <Button
            icon={<UploadOutlined />}
            onClick={async () => {
              const file = await window.api.sendMessage('sendFile');
              console.log(file);
            }}
          >
            Upload
          </Button>
          (Please upload JSON and YAML files that conform to the OpenAPI 3.0 specification.)
        </Space>
        <Table
          size="small"
          columns={columns}
          dataSource={apiList}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <List
                dataSource={record.apiList}
                renderItem={(item) => (
                  <List.Item>
                    {methodType[item.method]} {item.url}
                  </List.Item>
                )}
              />
            ),
            rowExpandable: (record) => record.name !== 'Not Expandable',
          }}
        />
      </Content>
    </Layout>
  );
};

export default Main;
