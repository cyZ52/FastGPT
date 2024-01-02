import jsonServerProvider from 'ra-data-json-server';
import { fetchUtils } from 'react-admin';

const customDataProvider = (url, httpClient = fetchUtils.fetchJson) => {
    const dataProvider = jsonServerProvider(url, httpClient);

    return (type, resource, params) => {
        if (type === 'GET_LIST' && resource === 'chat') {
            // 在这里定制聊天记录的请求方式
            const customParams = {
                ...params,
                // 添加你的定制参数
            };

            // 这里可以使用自定义的URL、headers等
            const customUrl = '/users/chatDialog';

            return httpClient(customUrl, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${customParams.token}`,  // 从customParams中获取token
                },
                body: JSON.stringify({
                    page: customParams.page || 1,
                    pageSize: customParams.pageSize || 10,
                }),
            })
                .then(response => response.json())
                .then(data => ({
                    data: data,  // 返回聊天记录的数据
                    total: data.length,  // 如果有分页，提供总数
                }));
        }

        // 对于其他资源，使用默认的DataProvider
        return dataProvider(type, resource, params);
    };
};

export default customDataProvider;