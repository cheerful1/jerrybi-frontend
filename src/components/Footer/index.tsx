import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
const Footer: React.FC = () => {
  const defaultMessage = '苏ICP备2023081688';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '枫智能 BI',
          title: '欢迎访问我的GitHub',
          href: 'https://github.com/cheerful1',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/cheerful1',
          blankTarget: true,
        },
        {
          key: '枫智能 BI',
          title: '我的空间',
          href: 'https://jerryhut.cn',
          blankTarget: true,
        },
      ]}
    />
  );
};
export default Footer;
