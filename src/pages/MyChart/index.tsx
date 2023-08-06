import {listMyChartByPageUsingPOST} from '@/services/yubi/chartController';



import { Card, message} from 'antd';
import { useModel } from '@@/exports';


import React, {useEffect, useState} from 'react';

import ReactECharts from 'echarts-for-react';
import List from 'antd/lib/list';
import Avatar from 'antd/es/avatar/avatar';
import Search from "antd/es/input/Search";


/**

 * 添加图表页面
 * 能用样式就不要自己写
 * @constructor

 */

const MyChart: React.FC = () => {

  //把初始条件提取出来
  const initSearchParams = {
    current: 1,
    pageSize: 4,
  }
  //获取后端数据

  //searchParams 前端向后端发送的请求
  // ...initSearchParams 把对象展开生成是一个新的对象，防止对象污染，不小心改变了initSearchParams的值
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams})

  //获取当前用户的信息
  const { initialState } = useModel('@@initialState');

  const { currentUser } = initialState ?? {};
  //需要将返回对象的数据展示到前端，所以需要存一下数据
  const [chartList, setChartList] = useState<API.Chart[]>();
  //因为是分页，所以需要一个数据总数，number
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);



  const loadData = async () => {

    setLoading(true);

    try {

      const res = await listMyChartByPageUsingPOST(searchParams);

      if (res.data) {

        setChartList(res.data.records ?? []);

        setTotal(res.data.total ?? 0);

        // 隐藏图表的 title

        if (res.data.records) {

          res.data.records.forEach(data => {

            const chartOption = JSON.parse(data.genChart ?? '{}');

            chartOption.title = undefined;

            data.genChart = JSON.stringify(chartOption);

          })

        }

      } else {

        message.error('获取我的图表失败');

      }

    } catch (e: any) {

      message.error('获取我的图表失败，' + e.message);

    }

    setLoading(false);

  };



  useEffect(() => {

    loadData();

  }, [searchParams]);



  return (

    <div className="my-chart-page">

      <div>

        <Search placeholder="请输入图表名称" enterButton loading={loading} onSearch={(value) => {

          // 设置搜索条件

          setSearchParams({

            ...initSearchParams,

            name: value,

          })

        }}/>

      </div>

      <div className="margin-16" />

      <List

        grid={{

          gutter: 16,

          xs: 1,

          sm: 1,

          md: 1,

          lg: 2,

          xl: 2,

          xxl: 2,

        }}

        pagination={{

          onChange: (page, pageSize) => {

            setSearchParams({

              ...searchParams,

              current: page,

              pageSize,

            })

          },

          current: searchParams.current,

          pageSize: searchParams.pageSize,

          total: total,

        }}

        loading={loading}

        dataSource={chartList}

        renderItem={(item) => (

          <List.Item key={item.id}>

            <Card style={{ width: '100%' }}>

              <List.Item.Meta

                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}

                title={item.name}

                description={item.chartType ? '图表类型：' + item.chartType : undefined}

              />

              <div style={{ marginBottom: 16 }} />

              <p>{'分析目标：' + item.goal}</p>

              <div style={{ marginBottom: 16 }} />

              <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />

            </Card>

          </List.Item>

        )}

      />

    </div>

  );

};

export default MyChart;
