import Footer from '@/components/Footer';
import { Question } from '@/components/RightContent';
import { getLoginUserUsingGET } from '@/services/yubi/userController';
import { LinkOutlined } from '@ant-design/icons';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import { AvatarDropdown, AvatarName } from './components/RightContent/AvatarDropdown';
import { errorConfig } from './requestConfig';


const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  currentUser?: API.LoginUserVO;
}> {
  const fetchUserInfo = async () => {
    try {
      const res = await getLoginUserUsingGET();
      return res.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      currentUser,
    };
  }

  return {};
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    logo: <svg t="1691324720082" className="icon" viewBox="0 0 1024 1024" version="1.1"
               xmlns="http://www.w3.org/2000/svg" p-id="2452" width="32" height="32">
      <path
        d="M764.354 581.144c8.512 1.037-31.47 68.793-36.119 74.272-17.811 20.553-40.396 45.918-70.288 43.635-20.427-1.577-33.96-18.392-46.873-31.469-1.785-1.869-38.236-45.171-29.561-44.257 37.822 4.026 69.583 1.245 106.741-3.571-34.46-0.166-79.132 4.69-106.033-22.627 23.497-22.003 52.6-37.156 74.479-61.029 19.639-21.464 31.843-46.914 48.657-70.081-16.814 23.167-40.022 42.057-63.728 57.667-21.797 14.24-39.772 33.837-65.597 40.146-12.87 3.073-66.053-193.551-77.802-214.517 5.647 18.226 6.976 35.206 9.631 53.971 3.903 27.235 11.625 54.595 17.147 81.624 6.228 29.809 13.493 60.033 21.962 89.137 1.121 3.86-72.571-16.398-77.512-17.979-30.515-10.17-60.656-21.256-88.888-36.66 37.614 45.96 118.033 79.175 176.737 84.488-34.334 29.186-88.058 32.3-131.566 33.67 42.928 10.297 102.256 10.919 143.233-2.74 18.682-6.27 6.476 65.182-1.204 72.988-23.415 23.664-64.477 27.359-95.199 21.629-41.433-7.722-125.09-54.471-136.673-98.686 21.505-8.469 44.505-14.655 66.261-23.126-39.15 9.302-83.159-23.83-107.321-50.484-8.22-9.049-64.518-100.802-69.541-99.764 42.389-8.511 93.704-21.796 137.255-16.19 24.163 3.112 72.861 35.538 85.648 56.296-65.306-105.826-14.281-205.716 33.712-306.187 84.944 59.992 165.404 157.391 125.464 270.067 32.466-92.915 107.197-114.877 188.777-142.9 12.289 95.654-9.508 208.954-89.927 272.806 18.481-7.97 38.118-12.579 58.128-10.129z"
        fill="#C8D62C" p-id="2453"></path>
    </svg>,
    actionsRender: () => [<Question key="doc" />],
    avatarProps: {
      src: initialState?.currentUser?.userAvatar,
      title: <AvatarName />,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    layoutBgImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((preInitialState) => ({
                ...preInitialState,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  ...errorConfig,
};
