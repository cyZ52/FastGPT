import {
  createTextField,
  jsonServerProvider,
  ListTable,
  Resource,
  Tushan,
  fetchJSON,
  TushanContextProps,
  HTTPClient
} from 'tushan';
import { authProvider } from './auth';
import { userFields, payFields, kbFields, ModelFields, SystemFields, ChatFields } from './fields';
import { Dashboard } from './Dashboard';
import { IconUser, IconApps, IconBook, IconStamp, IconList } from 'tushan/icon';
import { i18nZhTranslation } from 'tushan/client/i18n/resources/zh';

const i18n: TushanContextProps['i18n'] = {
  languages: [
    {
      key: 'zh',
      label: '简体中文',
      translation: i18nZhTranslation
    }
  ]
};

const authStorageKey = 'tushan:auth';

const httpClient: HTTPClient = async (url, options = {}) => {
  try {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }
    const { token } = JSON.parse(window.localStorage.getItem(authStorageKey) ?? '{}');
    (options.headers as Headers).set('Authorization', `Bearer ${token}`);

    const path = new URL(url).pathname;

    if (path === '/users/chatDialog') {
      options.method = 'POST';
      (options.headers as Headers).set('Content-Type', 'application/json');
      options.body = JSON.stringify({
        page: 1,
        pageSize: 10
      });
    }

    const urlWithoutQueryString = url.split('?')[0];
    return fetchJSON(urlWithoutQueryString, options);
  } catch (err) {
    return Promise.reject();
  }
};



const dataProvider = jsonServerProvider('http://a132810.e1.luyouxia.net:25563', httpClient);


function App() {
  try {
    return (
      <Tushan
        basename="/"
        header={'FastGpt-Admin-李时珍AI后台管理系统'}
        i18n={i18n}
        dataProvider={dataProvider}
        authProvider={authProvider}           // 登录验证
        dashboard={<Dashboard />}
      >
        <Resource
          name="users"
          label="用户信息"
          icon={<IconUser />}
          list={
            <ListTable
              filter={[
                createTextField('username', {
                  label: 'username'
                })
              ]}
              fields={userFields}
              action={{ detail: true, edit: true }}
            />
          }
        />
        <Resource
          name="models"
          icon={<IconApps />}
          label="应用"
          list={
            <ListTable
              filter={[
                createTextField('id', {
                  label: 'id'
                }),
                createTextField('name', {
                  label: 'name'
                })
              ]}
              fields={ModelFields}
              action={{ detail: true, edit: true }}
            />
          }
        />
        <Resource
          name="pays"
          label="支付记录"
          icon={<IconStamp />}
          list={
            <ListTable
              filter={[
                createTextField('userId', {
                  label: 'userId'
                })
              ]}
              fields={payFields}
              action={{ detail: true }}
            />
          }
        />
        <Resource
          name="kbs"
          label="知识库"
          icon={<IconBook />}
          list={
            <ListTable
              filter={[
                createTextField('name', {
                  label: 'name'
                }),
                createTextField('tag', {
                  label: 'tag'
                })
              ]}
              fields={kbFields}
              action={{ detail: true }}
            />
          }
        />

        <Resource
          name="system"
          label="系统"
          list={
            <ListTable
              fields={SystemFields}
              action={{ detail: true, edit: true, create: true, delete: true }}
            />
          }
        />
        <Resource
          name="users/chatDialog"
          label="聊天记录"
          icon={<IconList />}
          list={
            <ListTable
              fields={ChatFields}
              action={{ detail: true, edit: true }}
            />
          }
        />
      </Tushan>
    );
  }
  catch (err) {
    console.log(err);
  }

}

export default App;
